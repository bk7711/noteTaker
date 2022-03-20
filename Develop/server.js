const express = require('express');
const path = require('path');
const fs = require('fs');




const PORT = process.env.PORT || 3001;
const app = express();

//parse incoming string or array data
app.use(express.urlencoded({ extended: true}));
//parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname,  "/public/notes.html"));
})


// get notes in db.json to show on page
app.get('/api/notes', (req, res) => {
    let results = fs.readFileSync('./db/db.json', {encoding:'utf-8'})
    results = JSON.parse(results);
    if(results){
        res.json(results);
        console.log(results);
    }
    else{
        res.sendStatus(404);
    }
});

app.post('/api/notes', (req, res) => {
    
    console.info(`${req.method} request received to add a note`);
    
    const { title, text } = req.body;
    //set id based on what the next index of the array will be
    

    //validate if there is a title and text
    if(title && text){
        //set title and text = to new note
        const newNote = {
            title,
            text
        };
        console.log(newNote);
        // read the current db file and add new note to file
         let notes = fs.readFileSync('./db/db.json', {encoding:'utf-8'})
            //create array and add new note to array
            notes = JSON.parse(notes);
            notes.push(newNote);
            
            for(let i = 0; i<notes.length; i++){
                notes[i].id = [i];
            }
            
            
            
            fs.writeFile('./db/db.json', JSON.stringify(notes), {encoding:'utf-8'}, (err) => {
                if(err){
                    throw err;
                }
                console.log('file written');
            })
        

        const response = {
        status: 'success',
        body: newNote,
      };
        
        res.json(response);
    }else{
        res.json('Error in posting review');
    }
    
});

app.delete('/api/notes/:id', (req, res) => {
    
    res.send('Delete complete!');
    let noteId = req.params.id;
    console.log(`noteId = ${noteId}`);
    let findNote = fs.readFileSync('./db/db.json', {encoding:'utf-8'})
    let findNotes = JSON.parse(findNote)
    //loop through the notes and find the one with matching id and remove
    for(let i = 0; i < findNotes.length; i++){
        if (findNotes[i].id === noteId){
            findNotes.splice(i, 1);
            console.log(`noteId = ${noteId}`);
        }
        console.log(`notes after delete ${findNotes}`);
    }
})

//return index.html
app.get('*', (req, res) => {
    
    res.sendFile(path.join(__dirname,  "/public/index.html"));
});




app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
})