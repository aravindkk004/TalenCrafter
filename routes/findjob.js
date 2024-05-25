import express from "express";
import db from "../database/db.js";
import multer from "multer";
import OpenAI from "openai";
import env from "dotenv";
import axios from "axios";
env.config();

const router = express.Router();

// const upload = multer({
//     storage:multer.memoryStorage(),
// });

//openai
// const openai = new OpenAI({ apiKey: process.env.CHATGPT_API });

router.post("/userhome", async (req, res) => {
  const { comname, location, jobtitle } = req.body;
  let result;
  const lowerComname = comname.toLowerCase();
  const lowerLocation = location.toLowerCase();
  const lowerJobtitle = jobtitle.toLowerCase();
  let whereClause = "";
  const queryParams = [];

  if (lowerComname !== "") {
    whereClause += `(LOWER(employerProfile.companyname) LIKE '%' || $${
      queryParams.length + 1
    } || '%')`;
    queryParams.push(lowerComname);
  }
  if (lowerLocation !== "") {
    if (whereClause !== "") whereClause += " AND ";
    whereClause += `(LOWER(jobs.location) LIKE '%' || $${
      queryParams.length + 1
    } || '%')`;
    queryParams.push(lowerLocation);
  }
  if (lowerJobtitle !== "") {
    if (whereClause !== "") whereClause += " AND ";
    whereClause += `(LOWER(jobs.title) LIKE '%' || $${
      queryParams.length + 1
    } || '%')`;
    queryParams.push(lowerJobtitle);
  }

  if (lowerComname !== "" || lowerLocation !== "" || lowerJobtitle !== "") {
    result = await db.query(
      `
            SELECT * 
            FROM jobs 
            JOIN employerProfile ON jobs.employer_id = employerProfile.id 
            WHERE ${whereClause}
        `,
      queryParams
    );
  } else {
    return res.render("candidate/serchresult.ejs");
  }
  res.render("candidate/serchresult.ejs", { details: result.rows });
});

//upload resume
// router.post("/", upload.single("pdfFile"), async (req,res)=>{
//     const pdfBuffer = req.file.buffer;
//     try{
//         const uploadUrl = 'https://api.pdf.co/v1/file/upload/base64';
//         const body = {
//             file: 'data:application/pdf;base64,' + Buffer.from(pdfBuffer).toString('base64'),
//         };
//         const urlResponse = await axios.post(uploadUrl, body, {
//             headers: {
//               'x-api-key': process.env.PDFTOTEXT,
//             },
//         });
//         const textUrl = 'https://api.pdf.co/v1/pdf/convert/to/text';
//         const response1 = await axios.post(textUrl, {
//             url : urlResponse.data.url,
//             "inline": true,
//             "async": false
//         }, {
//             headers: {
//               'Content-Type': 'application/json',
//               'x-api-key': process.env.PDFTOTEXT,
//             },
//         });

//         //openai
//         const textContent = response1.data.body;
//         console.log("text content",textContent);
//         const prompt = textContent+"\n"+"This is an Text Content in a resume \n i need \n1.skills(array like [python,java,..]) \n2.address {country:'',state:'',city:''}\n3.contact {name : '' , email : '' , phone : ''}\n4.specialization eg (FullStack) (need all of this only) details \n return me a json stringified version don't add unnessacery data";

//         const response = await openai.completions.create({
//             model: 'gpt-3.5-turbo-instruct', // Replace with your desired model
//             prompt: prompt,
//             max_tokens: 1000,
//             temperature: 0.7,
//         });
//         const data = JSON.parse(response.choices[0].text);

//         console.log("typesof this", typeof(JSON.parse(response.choices[0].text)) );

//         res.render("candidate/findjob.ejs", {userData: data, extracted: textContent});
//     }catch(err){
//         console.log(err);
//     }
// });

export default router;
