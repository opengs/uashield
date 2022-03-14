## PLEASE SHARE WITH YOUR FRIENDS AND ANYONE WHO WANTS TO HELP BUT DOESN'T KNOW HOW!!!

 The main idea behind uashield on Azure is the following: uashield is able to dynamically update proxies and target IPs. So you, as a user, only have to follow the instructions below and as a result you will add a few servers to something like a botnet. Everything else will be done by guys from the uashield community.
 Link to the project: [https://github.com/opengs/uashield](https://github.com/opengs/uashield).

1. Go to [https://azure.microsoft.com/en-us/](https://azure.microsoft.com/en-us/).
2. Press &quot;Free account&quot; - &quot;Start free&quot;.

![](https://github.com/opengs/uashield/blob/master/tools/azure/images/1.jpg)
![](https://github.com/opengs/uashield/blob/master/tools/azure/images/2.jpg)

3. Do the registration. They will ask for your bank card information. You must have 1$ in order to pass card validation (it will be returned).

 ![](https://github.com/opengs/uashield/blob/master/tools/azure/images/3.jpg)

4. After the registration, go to the Microsoft Azure main page [https://portal.azure.com/#home](https://portal.azure.com/#home)
5. Select &quot;Virtual machines&quot; from the list.

 ![](https://github.com/opengs/uashield/blob/master/tools/azure/images/4.jpg)

6. Upper left corner - press &quot;Create&quot; - &quot;Virtual machine&quot;.

 ![](https://github.com/opengs/uashield/blob/master/tools/azure/images/5.jpg)
 ![](https://github.com/opengs/uashield/blob/master/tools/azure/images/6.jpg)

7. In the config do the following:
* Virtual machine name – something like &quot;vm1&quot;, &quot;vm2&quot; or whatever you want.
* Region – as close to the aim as possible (I prefer Japan East) :D
* Image – Ubuntu Server 20.04.
* Check &quot;Azure Spot Instance&quot;.
* Eviction policy – delete.
* Size – Standart\_D4s\_v4 – 4 vcpus, 16 GiB memory. (As you can see, the price for the server is something like 0.026$/hr. With a free 200$ for &quot;Free account&quot; we&#39;re able to use 200/0.026 = 7692 hrs of server time for free. For example, 10 servers will work for free for 7692/10 = 769 hrs, its about 32 days! If Standart\_D4s\_v4 is not available, try to select other 4 vcpus and 16 GiB memory, but if it is much more expencive, then try other region.

 ![](https://github.com/opengs/uashield/blob/master/tools/azure/images/7.jpg)
 ![](https://github.com/opengs/uashield/blob/master/tools/azure/images/8.jpg)

8. Go to &quot;Advanced&quot; tab (above) and paste the script [https://github.com/opengs/uashield/blob/master/tools/azure/azure-custom-data-script.sh](https://github.com/opengs/uashield/blob/master/tools/azure/azure-custom-data-script.sh) (just copy it as a text) to &quot;Custom data&quot;.

 ![](https://github.com/opengs/uashield/blob/master/tools/azure/images/9.jpg)

9. Go to &quot;Disk&quot; tab and change &quot;OS disk type&quot; from &quot;Premium SSD&quot; to &quot;Standart SSD&quot;.

![](https://github.com/opengs/uashield/blob/master/tools/azure/images/10.jpg)

10. &quot;Review + create&quot; – &quot;Create&quot;.

 ![](https://github.com/opengs/uashield/blob/master/tools/azure/images/11.jpg)
 ![](https://github.com/opengs/uashield/blob/master/tools/azure/images/12.jpg)

11. Wait until deployment is complete.

![](https://github.com/opengs/uashield/blob/master/tools/azure/images/13.jpg)

![](https://github.com/opengs/uashield/blob/master/tools/azure/images/14.jpg)

You have successfully created one server. You can repeat steps 5-11 until you exceed the limit of vCPUs available for your free account (Azure won&#39;t let you create one more server).

### IMPORTANT If you exceed the limit in one region, you can try another one and you will be able to launch servers there
### WARNING Don`t use Australia region. Network traffic is every expensive from there. 