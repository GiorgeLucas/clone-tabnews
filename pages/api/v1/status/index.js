function status(request, response) {
  response.status(200).json({ text: "Olá mundo" });
}

export default status;
