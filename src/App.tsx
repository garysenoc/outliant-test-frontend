import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, Stack, TextField, Typography } from "@mui/material";

interface BookDetails {
  id: string;
  title: string;
  authorName: string;
  publicationYear: number;
  ISBN: string;
  numOfPages: number;
}

interface Book {
  title: string;
  authorName: string;
  publicationYear: number;
  ISBN: string;
  numOfPages: number;
}

const bookDefault = {
  title: "",
  authorName: "",
  publicationYear: 2000,
  ISBN: "",
  numOfPages: 0,
} as Book;

const foundBookDefault = { ...bookDefault, id: "" };

function App() {
  const [isFound, setIsFound] = useState(false);
  const [create, setCreate] = useState<Book>(bookDefault);
  const [update, setUpdate] = useState<Book>(bookDefault);
  const [bookID, setBookID] = useState("");
  const [books, setBooks] = useState<[BookDetails]>();
  const [found, setFound] = useState<BookDetails>(foundBookDefault);
  const [findBookID, setfindBookID] = useState("");

  const getBooks = async () => {
    try {
      let result = (await (
        await fetch(`http://localhost:8000/book`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json()) as [BookDetails];
      setBooks(result);
    } catch (error) {}
  };

  const createSubmit = async () => {
    try {
      await fetch("http://localhost:8000/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(create),
      });
      getBooks();
    } catch (error) {}
  };

  const updateSubmit = () => {
    try {
      let updatedBook = JSON.parse(JSON.stringify(update));
      if (update.ISBN === "") {
        const { ISBN, ...rest } = updatedBook;
        updatedBook = rest;
      }
      if (update.authorName === "") {
        const { authorName, ...rest } = updatedBook;
        updatedBook = rest;
      }
      if (update.title === "") {
        const { ISBN, ...rest } = updatedBook;
        updatedBook = rest;
      }
      console.log(updatedBook);
      fetch(`http://localhost:8000/book/${bookID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBook),
      });
      getBooks();
    } catch (error) {}
  };

  const searchSubmit = async () => {
    try {
      let result = await (
        await fetch(`http://localhost:8000/book/${findBookID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();
      setIsFound(true);
      setFound(result);
    } catch (error) {
      setFound({ ...foundBookDefault, id: "NFR" });
      setIsFound(false);
    } finally {
      getBooks();
    }
  };

  const deleteSubmit = async () => {
    try {
      let result = await (
        await fetch(`http://localhost:8000/book/${findBookID}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();
      console.log("HERE:", result);
      setIsFound(true);
      setFound(result);
    } catch (error) {
      setFound({ ...foundBookDefault, id: "NFR" });
      setIsFound(false);
    } finally {
      getBooks();
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div className="App" style={{ padding: "20px" }}>
      <Stack direction="row" spacing={5}>
        <form onSubmit={createSubmit}>
          <Stack direction="column" spacing={2}>
            <Typography>Create</Typography>
            <TextField
              label="Title"
              onBlur={(e) => {
                setCreate((prev) => ({ ...prev, title: e.target.value }));
              }}
            />
            <TextField
              label="Author"
              onBlur={(e) => {
                setCreate((prev) => ({ ...prev, authorName: e.target.value }));
              }}
            />
            <TextField
              label="Publication year"
              onBlur={(e) => {
                setCreate((prev) => ({
                  ...prev,
                  publicationYear: +e.target.value,
                }));
              }}
            />
            <TextField
              label="ISBN"
              onBlur={(e) => {
                setCreate((prev) => ({ ...prev, ISBN: e.target.value }));
              }}
            />
            <TextField
              label="Number of pages"
              onBlur={(e) => {
                setCreate((prev) => ({ ...prev, numOfPages: +e.target.value }));
              }}
            />
            <Button variant="contained" onClick={createSubmit}>
              Create
            </Button>
          </Stack>
        </form>
        <form onSubmit={updateSubmit}>
          <Stack direction="column" spacing={2}>
            <Typography>Update</Typography>
            <TextField
              label="Book ID"
              onBlur={(e) => {
                setBookID(e.target.value);
              }}
            />
            <TextField
              label="Title"
              onBlur={(e) => {
                setUpdate((prev) => ({ ...prev, title: e.target.value }));
              }}
            />
            <TextField
              label="Author"
              onBlur={(e) => {
                setUpdate((prev) => ({ ...prev, authorName: e.target.value }));
              }}
            />
            <TextField
              label="Publication year"
              onBlur={(e) => {
                setUpdate((prev) => ({
                  ...prev,
                  publicationYear: +e.target.value,
                }));
              }}
            />
            <TextField
              label="New ISBN"
              onBlur={(e) => {
                setUpdate((prev) => ({ ...prev, ISBN: e.target.value }));
              }}
            />
            <TextField
              label="Number of pages"
              onBlur={(e) => {
                setUpdate((prev) => ({ ...prev, numOfPages: +e.target.value }));
              }}
            />
            <Button variant="contained" onClick={updateSubmit}>
              Update
            </Button>
          </Stack>
        </form>
      </Stack>
      <br />
      <Stack direction="row" spacing={5}>
        <Stack direction="column" spacing={2}>
          {books?.map((book) => (
            <div>
              <Typography>{book.id}</Typography>
              <Typography>{book.authorName}</Typography>
              <Typography>{book.title}</Typography>
              <Typography>{book.publicationYear}</Typography>
              <Typography>{book.ISBN}</Typography>
              <Typography>{book.numOfPages}</Typography>
            </div>
          )) ?? <Typography>No Data</Typography>}
        </Stack>
        <Stack direction="column" spacing={2}>
          <TextField
            label="Book ID"
            onBlur={(e) => {
              setfindBookID(e.target.value);
            }}
          />
          <Button variant="contained" onClick={searchSubmit}>
            Find
          </Button>
          <Button variant="contained" onClick={deleteSubmit}>
            Delete
          </Button>
          {isFound && (
            <div>
              <Typography>{found.id}</Typography>
              <Typography>{found.authorName}</Typography>
              <Typography>{found.title}</Typography>
              <Typography>{found.publicationYear}</Typography>
              <Typography>{found.ISBN}</Typography>
              <Typography>{found.numOfPages}</Typography>
            </div>
          )}
          {!isFound && found.id !== "" && (
            <Typography>Book not found</Typography>
          )}
        </Stack>
      </Stack>
    </div>
  );
}

export default App;

