using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CSharp.RuntimeBinder;
using Newtonsoft.Json;

namespace MyGlenigan.Web.Controllers
{
    public partial class ChartsController : Controller
    {
        static ChartsController()
        {

        }

        private string hueApi = "http://www.threatrate.com/api/";

        [HttpGet]
        public string index(string url)
        {
            using (var webClient = new HttpClient())
            {
//                var method = "GET";
                var username = "sasha.nike@gmail.com";
                var password = "sasha666";
                var authorization = "Basic " + Convert.ToBase64String(Encoding.UTF8.GetBytes(username + ":" + password));
                webClient.DefaultRequestHeaders.Add("Authorization", authorization);

                var address = hueApi + url + Request.QueryString;
                var response = webClient.GetAsync(address).Result;
                var data = response.Content.ReadAsStringAsync().Result;

                var obj = JsonConvert.DeserializeObject<object>(data);

                return data;
            }
        }
    }
}