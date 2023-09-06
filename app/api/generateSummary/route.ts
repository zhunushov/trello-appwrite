import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { todos } = await request.json();
  console.log("POST >>>>>>>", todos);

  const response = await openai.chat.completions.create({
    n: 1,
    model: "gpt-3.5-turbo",
    stream: false,
    temperature: 0.8,
    messages: [
      // {
      //   role: "system",
      //   content:
      //     "Привет это для теста если работаешь скажи шутку! Limit the response to 300 cheracters",
      // },
      {
        role: "system",
        content:
          "When responding, welcome the user alwaays as Mr.Sonny and say welcome to the Makers.kg Todo App! Limit the response to 200 cheracters",
      },
      {
        role: "user",
        content: `Hi there, provide a summary of the following todos. Count how many todos are in each category such as To do, progress and done, then tell the user to hove a productive day! Here's the data: ${JSON.stringify(
          todos
        )} `,
      },
    ],
  });

  console.log(response.choices[0].message);
  console.log(response);

  return NextResponse.json(response.choices[0].message);
}
