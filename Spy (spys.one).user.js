// ==UserScript==
// @name         Spy (spys.one)
// @namespace    http://N/A.net/
// @version      0.2
// @description  Try to access to the world!
// @author       E.T.R.A
// @match        https://spys.one/free-proxy-list/CN/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
	/* 变量声明 */

    var show_per_page
    var proxy_type_select
    var re = /goog/i

    /* prototy声明 */

    Number.prototype.toSecond = function(){return this*1000}//给Number增加toSecond方法
    Number.prototype.toMinute = function(){return this*1000*60}//给Number增加toMinute方法

    /* 函数声明 */

    /* 网页解析函数 */
    function IP_parser(){

        var ip = document.getElementsByTagName("acronym");//获取页面上含EndIP的元素，注意有时候重复

        for(let i = 0,index = 1; i < ip.length; i++){//index只做标号使用，未使用在数据处理当中；i作为内部循环标号使用

            if(ip[i].title.toString().match(/End/)){//如果RE匹配成功，也就是此元素存在

                console.log(index);//标号输出

                //以下为:原ip的初步获取-->原ip的地址获取-->原ip的端口获取
                var Original_IP_Not_Sorted = ip[i].parentElement.parentElement.parentElement.innerText.split(":",2);//三次父元素巡航，找到innerText，也就是其中的文本类字符串并以“:”冒号初步分割ip地址。
                var Original_IP = Original_IP_Not_Sorted[0].trim();//原ip获取
                var Original_IP_Port = Original_IP_Not_Sorted[1].slice(0,Original_IP_Not_Sorted[1].indexOf("SOCKS",0)).trim();//找到初步解析的原ip端口并两端去空白

                localStorage.setItem(Original_IP,index + ' ' + Original_IP + ':' + Original_IP_Port + ' '+ Date())//在localStorage中存储所有ip数据信息，格式:key(ip) : value(序号+ip+端口+日期)

                index++;//数据处理完成之后增加标号

                //以下为数据的输出
                console.log("Original IP:" + Original_IP + ":" + Original_IP_Port);
                console.log(ip[i].title.toString().match(/End/).input);//则输出成功匹配的元素的值，此处是EndIP

            }
        }
        console.log('\nLast time refresh at ' + Date())//输出上次刷新的时间
        localStorage_cleaner()
        Save_socks(JSON.stringify(localStorage,null,'\t'),'temp_socks_list_parsed'+Date()+'.txt')
    }

///* 清理由于谷歌广告导致存储不必要的数据，当AdBlocker未能开启的时候使用
    function localStorage_cleaner(){
        for (let i in localStorage){
            if(re.test(i)){
                localStorage.removeItem(i)
            }
        }
    }
//*/

    /* 保存localstorage的数据到本地 */
    function Save_socks(localstorage_list, file_name){

        //创建a元素，利用元素属性进行下载
        let a = document.createElement('a')
        a.download = file_name

        //将内容转换为blod地址
        let blob = new Blob([localstorage_list])
        a.href = URL.createObjectURL(blob)

        //将下载链接添加到页面
        document.body.appendChild(a)
        a.click()

        //删除下载链接
        document.body.removeChild(a)
    }

    function Show_100_Type_socks(){

        show_per_page.value = "2";//2 对应的是每页100个

        proxy_type_select.value = "2";//2 对应的是每页100个

        proxy_type_select.onchange();//触发onchange事件

        show_per_page.onchange();//触发onchange事件

    }

    function Check_this_page(){

        /* 获取 |代理类型选择框| 和 |每页显示个数选择框| 对象 */

        show_per_page = document.getElementById("xpp");

        proxy_type_select = document.getElementById("xf5");

        /* 查看当前页面是否是 "|socks| 每页 |100| 个显示"，即页面已修改 */

        if(!(show_per_page.value == '2' && proxy_type_select.value == '2')){

            /* 当前页面不是所需页面，故进行修改 */

            Show_100_Type_socks()

        }else{

            /* 当前页面是所需页面，故进行解析 */
            IP_parser()
        }

    }

    /* 加载完成后运行入口 */
    window.onload=function(){

        setTimeout(execute_my_script,1)
        setTimeout(Refresh_this_page,Number(30).toMinute())//半小时后刷新页面

    }
	/* 实际运行的函数-任务1 */
    function execute_my_script(){

        Check_this_page()

    }
    /* 实际运行的函数-任务2 */
    function Refresh_this_page(){
        location.reload()
    }
})();