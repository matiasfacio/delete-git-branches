#!/usr/bin/env node

const { exec } = require("child_process");
const inquirer = require("inquirer");

exec("git branch", (error, stdout, stderr) => {
  if (error) {
    console.error(error);
    return;
  }

  if (stderr) {
    console.error("stderr:", stderr);
  }

  const replaceStars = stdout.replace("*", ""); // replace * with an empty string
  const branchesArray = replaceStars.split(" "); // this will finally display /n
  const newBranch = branchesArray.filter((t) => t !== "*" && t !== ""); // here we remove * and ""
  const filteredNewBranch = newBranch.map((value) => {
    return value.replace(/(\n$)/gm, "");
  });

  inquirer
    .prompt([
      {
        type: "checkbox",
        name: "branches",
        message: "which branches do you want to delete?",
        choices: filteredNewBranch,
      },
    ])
    .then((answers) =>
      exec(`git branch -D ${answers.branches}`, (error, stdout, stderr) => {
        if (error) {
          console.log("sorry, there was an error");
        }
        if (stderr) {
          if (
            answers.branches.includes("main") ||
            answers.branches.includes("master")
          ) {
            console.error(`you cannot delete ${answers.branches}`);
            return;
          }
          console.error(stderr, " > are you currently on this branch ?");
        }
        if (stdout) {
          console.log("Successful:", stdout);
        }
      })
    );
});
