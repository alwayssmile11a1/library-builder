const fs = require('fs-extra');
const os = require('os');
const path = require('path');

const allTestsFolderPath = "./all_tests";

const libraryFolderName = "cambridge_library";
const libraryJSON = {
  "title": "Cambridge IELTS Library", 
  "description": "Cambridge IELTS Library", 
  "image": "C_L", 
  "id": "C_L"
}

const collectionFolderName = "cambridge_{collection}_academic_collection";
const collectionJSON = {
  "title": "Cambridge IELTS {collection} Academic",
  "description": "Cambridge IELTS {collection} Academic",
  "image": "C_{collection}_A",
  "test_type": "academic",
  "id": "C_{collection}_A",
  "library_id": "C_L"
}

const testFolderName = "test_{test}";
const testJSON = {
  "name": "Cambridge IELTS {collection} Academic Test {test}",
  "image": "C_{collection}_A_{test}",
  "id": "C_{collection}_A_{test}",
  "collection_id": "C_{collection}_A"
}

const skillTestName = "Cambridge IELTS {collection} Academic {skill} Test {test}";
const skills = ["Reading", "Listening", "Writing", "Speaking"];
const skillTestNameTrimer = "Cambridge IELTS {collection} Academic";

const maxCollectionNumber = 17;
const minCollectionNumber = 10;

const maxSkillTestNumber = 4;
const minSkillTestNumber = 1;


// create the library folder
let libraryFolderPath = path.join(os.homedir(), 'Desktop') + "/" + libraryFolderName;
fs.mkdir(libraryFolderPath, function(err) {

  // create the JSON library file
  fs.writeFile(libraryFolderPath + "/" + libraryFolderName + ".json", JSON.stringify(libraryJSON), function(err) {
    if (err) {
      console.log('Error creating JSON library file.');
    } else {
      
      //loop through all possible collections
      for (let i = minCollectionNumber; i <= maxCollectionNumber; i++)
      {

        //get collection path
        let collectionPath = libraryFolderPath + "/" + collectionFolderName.replaceAll("{collection}", i);
        
        //loop through all skills
        skills.forEach(skill => {
          
          for (let j = minSkillTestNumber; j <= maxSkillTestNumber; j++)
          {
            let currentSkillTestName = skillTestName.replaceAll("{collection}", i);
            currentSkillTestName = currentSkillTestName.replaceAll("{skill}", skill);
            currentSkillTestName = currentSkillTestName.replaceAll("{test}", j);

            //read test skill file and copy content
            fs.readFile(allTestsFolderPath + "/" + currentSkillTestName + ".json", 'utf8', function(err, skillData) {
              if (err) {
                console.log('NOT EXISTED: ' + currentSkillTestName);
              } else {

                //create collection folder. Should be only 1 time but I'm lazy so just do this everytime
                fs.mkdir(collectionPath, function(err) {

                  //create JSON for collection. Should be only 1 time but I'm lazy so just rewrite this everytime
                  let currentCollectionJSON = JSON.stringify(collectionJSON).replaceAll("{collection}", i);
                  fs.writeFile(collectionPath + "/" + collectionFolderName.replaceAll("{collection}", i) + ".json", currentCollectionJSON, function(err) {
                    if (err) {
                      console.log('Error writing JSON of ' + collectionPath);
                    } else {
                      
                    }
                  });

                  //create test folder. Should be only 1 time but I'm lazy so just do this everytime
                  let currentTestFolderName = testFolderName.replace("{test}", j);
                  let currentTestFolderPath = collectionPath + "/" + currentTestFolderName;
                  fs.mkdir(currentTestFolderPath, function(err) {

                    //create JSON for test folder. Should be only 1 time but I'm lazy so just rewrite this everytime
                    let currentTestJSON = JSON.stringify(testJSON).replaceAll("{collection}", i);
                    currentTestJSON = currentTestJSON.replaceAll("{test}", j);
                    fs.writeFile(currentTestFolderPath + "/" + currentTestFolderName + ".json", currentTestJSON, function(err) {
                      if (err) {
                        console.log('Error writing JSON of ' + currentTestFolderName);
                      } else {
                        
                      }
                    });
                    
                    skillData = JSON.parse(skillData);
                    skillData.name = skillData.name.replace(skillTestNameTrimer.replaceAll("{collection}", i),"").trim(); 
                    skillData = JSON.stringify(skillData);

                    //write skill content
                    fs.writeFile(currentTestFolderPath + "/" + skill.toLowerCase() + ".json", skillData, function(err) {
                      if (err) {
                        console.log(err);
                      } else {
                        
                      }
                    });
                  });

                });
              }
            });
          }
        });
      }

    }
  });

});