const express =require('express')
const Notes = require('../models/notes')
const router = express.Router()

router.post('/', async(req, res)=>{
  try{
    const data = req.body
    const newNotes = await Notes(data)
    await newNotes.save()
    res.status(201).json({
      success : true,
      message : 'notes created successfully..',
      newNotes
    })
  }catch(err){
    res.status(500).json({
      success : false,
      message : 'unable to proceed..'
    })
  }
  
})
//required
router.post('/:objectId', async (req, res) => {
    const { objectId } = req.params;  
    const { note } = req.body;        

    try {
        const notesDocument = await Notes.findById(objectId);

        if (!notesDocument) {
            return res.status(404).json({
                success: false,
                message: "Notes document not found"
            });
        }
        notesDocument.notes.push(note); 
        await notesDocument.save();
        res.status(200).json({
            success: true,
            message: "Note added successfully",
            data: notesDocument
        });

    } catch (err) {
        console.error("Error while adding note:", err);
        res.status(500).json({
            success: false,
            message: "Unable to add note"
        });
    }
});

//required
router.get('/:objectId', async (req, res) => {
    const { objectId } = req.params; 
    try {
      const notesData = await Notes.findById(objectId); 
      if (!notesData) {
        return res.status(404).json({
          success: false,
          message: 'Notes not found'
        });
      }
      res.status(200).json({
        success: true,
        data: notesData
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Cannot get notes"
      });
    }
  });


// Delete a note from the notes array
router.delete('/:objectId/:noteIndex', async (req, res) => {
    const { objectId, noteIndex } = req.params;
    try {
        const notesDocument = await Notes.findById(objectId);

        if (!notesDocument) {
            return res.status(404).json({
                success: false,
                message: "Notes document not found"
            });
        }

        if (noteIndex < 0 || noteIndex >= notesDocument.notes.length) {
            return res.status(400).json({
                success: false,
                message: "Invalid note index"
            });
        }

        notesDocument.notes.splice(noteIndex, 1);
        await notesDocument.save();

        res.status(200).json({
            success: true,
            message: "Note deleted successfully",
            data: notesDocument
        });

    } catch (err) {
        console.error("Error while deleting note:", err);
        res.status(500).json({
            success: false,
            message: "Unable to delete note"
        });
    }
});
  
module.exports = router    