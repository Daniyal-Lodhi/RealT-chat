# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

const getMessages = async (senderId, receiverId) => {
  try {
    const dbRef = ref(getDatabase());
    const senderSnapshot = await get(child(dbRef, `chats/${senderId}/${receiverId}`));

    if (senderSnapshot.exists()) {
      const sendersMsgs = senderSnapshot.val();
      const S_dataArray = Object.values(sendersMsgs);

      const receiverSnapshot = await get(child(dbRef, `chats/${receiverId}/${senderId}`));

      if (receiverSnapshot.exists()) {
        const receiversMsgs = receiverSnapshot.val();
        const R_dataArray = Object.values(receiversMsgs);

        let chatArr = [...S_dataArray, ...R_dataArray];
        chatArr = chatArr.sort((a, b) => a.time - b.time);

        setChatArr(chatArr);
      } else {
        console.log("No data available");
      }
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error(error);
  }
};