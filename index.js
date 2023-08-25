const { log } = require('console');
const express = require('express');
const axios = require('axios');
const app = express();
var newNote =[];
var array =[];
var arraySize = 0;
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
 mongoose.set('strictQuery',false);
//Connection to MongoDB database
//⁡⁢⁣⁣This line will specify the port where we will access our MongoDB Server
//⁡⁢⁣⁣Here "fruitsDB" is the name of the database where we want to connect to.⁡
const connectDB = async () =>{

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongo connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
    
  }

} 


const  notesSchema = {
    name: String,
}

const Note =  mongoose.model("Note",notesSchema);



async function deleteLastItem(collection) {
  try {
    const lastItem = await collection.deleteOne({ _id: -1 } );
    if (lastItem) {
      console.log('Last item deleted:', lastItem);
    } else {
      console.log('No items to delete.');
    }
  } catch (error) {
    console.error(error);
  }
}
async function fetchNotes(collection) {
  try {
    const notes = await collection.find();
    return notes;
    console.log(notes);
  } catch (error) {
    console.error(error);
  }
}

async function fetchNotesByName(collection,names) {
    try {
      const notes = await collection.find({name: names});
      console.log(notes);
    } catch (error) {
      console.error(error);
    }
}

async function fetchNotesDelete(collection,names) {
    try {
      const notes = await collection.deleteOne({name: names});
      console.log(notes);
    } catch (error) {
      console.error(error);
    }
}

async function fetchNotesUpdate(collection,names,update) {
    try {
      const notes = await collection.findOneAndUpdate({name: names},{name: update});
      console.log(notes);
    } catch (error) {
      console.error(error);
    }
}
async function fetchNotesdeleteMany(collection,names) {
    try {
      const notes = await collection.deleteMany({name: names});
      console.log(notes);
    } catch (error) {
      console.error(error);
    }
}
async function fetchNotesdeleteAll(collection) {
    try {
      const notes = await collection.deleteMany({});
      console.log(notes);
    } catch (error) {
      console.error(error);
    }
}
async function fetchNotesInsert(collection,doc) {
    try {
      return await collection.insertMany(doc);
      
    } catch (error) {
      console.error(error);
    }
}
//fetchNotesInsert(Note,{name: "Sam"});
//fetchNotesdeleteMany(Note ,"dave");
//fetchNotesdeleteAll(collection);
//fetchNotesUpdate(Note,"dave","john");
//fetchNotesByName(Note,"john");
//Note.insertMany(NoteArr);
async function fetchNotes(collection) {
    try {
      return( await collection.find());
     
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  //console.log(array);
  //fetchNotesInsert(Note,{name: "shane"});
  async function deleteLastDocument(collection) {
    try {
      const lastDocument = await collection.findOneAndRemove({}, { sort: { _id: -1 } });
  
      if (lastDocument) {
        console.log('Last document deleted:', lastDocument);
      } else {
        console.log('No documents to delete.');
      }
    } catch (error) {
      console.error(error);
    }
  }
  //fetchNotesdeleteMany(Note ,"Sam");
 // deleteLastDocument(Note);

   // fetchNotes(Note);
   
 
  fetchNotes(Note).then((result)=>{
    console.log(result.length);
  });


app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.listen(port);

app.post("/submit",(req,res)=>{
    if(req.body["addedNote"]=="delete"){
        fetchNotes(Note).then((result)=>{
            console.log(result.length);
           
            if(!result.length ){
                res.render("index.ejs");
    
            }else{
                
                
                deleteLastDocument(Note).then((result)=>{
                    fetchNotes(Note).then((result1)=>{
                        res.render("index.ejs",{
                            note: result1
                        });
                    })
                    
                })
                
            }

          });
        
        
    }else{
        
        
        fetchNotesInsert(Note,{name: req.body["addedNote"]}).then((result)=>{
            console.log(result);
                
                fetchNotes(Note).then((result)=>{
                    console.log(result.length);
                    
                    res.render("index.ejs",{
                        note: result
                    });
                });
           
        })
        
        
    }

   

});

app.get("/",(req,res)=>{

    fetchNotes(Note).then((result)=>{
        console.log(result.length);
        if(!result.length ){
            res.render("index.ejs");

        }else{
            res.render("index.ejs",{
                note: result
            });
        }
    });
    

});