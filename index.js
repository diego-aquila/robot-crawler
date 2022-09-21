const dbConfig = require('./firebase')
const puppeteer = require('puppeteer');
const fs = require('fs/promises')
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');



var admin = require("firebase-admin");

var serviceAccount = require("./cadastro-links-firebase-adminsdk-bwddv-6abaaa8430.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();
  

  async function robo() {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const sites = [
            {url: "https://devgo.com.br/", 
            sessao: ".blog-article-card > h1 > a", 
            nome: "devgo"},
            
           
        ]

        await page.goto(`${sites[0].url}`);
        // await page.screenshot({path: `${site.nome}.png`});
      
        const resultadoLink = await page.evaluate(() => {
           const nodeList = document.querySelectorAll('.blog-article-card > h1 > a')

           const valoresArray = [...nodeList]

           const list = valoresArray.map((e) => {  


            return {
                titulo: e.innerText,
                url: e.href
            }

           })
 
           return list
                 
        })

        resultadoLink.forEach(element => {
         

                    const res =  db.collection('links').add(
                        
                        {
                        titulo: element.titulo,
                        link: element.url
                      }
                      
                      );

        });

      
        await browser.close();
      };

     

      robo()

      

    

      
      



