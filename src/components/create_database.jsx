const createDatabase = () => {
  fetch("/drivers.json")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch local JSON");
      return response.json();
    })
    .then((data) => {
      return fetch("/drivers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to post data");
      return response.json(); 
    })
    .then((result) => console.log("Success:", result))
    .catch((error) => console.error("Error:", error));
};
export default createDatabase;