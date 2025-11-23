// import Message from "../models/Message.js";

// export const getMessages = async (req, res) => {
//   const messages = await Message.find().sort({ timestamp: 1 });
//   res.json(messages);
// };

// export const createMessage = async (req, res) => {
//   try {
//     const { sender, text } = req.body;

//     if (!sender || !text) {
//       return res.status(400).json({ error: "Sender & text required" });
//     }

//     const message = await Message.create({ sender, text });
//     res.status(201).json({ success: true, message });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };
