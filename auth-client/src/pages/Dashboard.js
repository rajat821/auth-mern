import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const history = useNavigate();
  const [quote, setQuote] = useState("");
  const [tempQuote, setTempQuote] = useState("");

  async function populateQuote() {
    const req = await fetch('http://localhost:1337/api/quote', {
      method:'POST',
      headers: {
        'x-access-token': localStorage.getItem('token'),
      },
    });

    const data = await req.json();

    if (data.status === "ok") {
      setQuote(data.quote);
    } else {
      alert(data.error);
    }
  }
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = jwt_decode(token);
      if (!user) {
        localStorage.removeItem('token');
        history('/login');
      } else {
        populateQuote();
      }
    }
  }, []);

  async function updateQuote(event){
    event.preventDefault();
    const req = await fetch("http://localhost:1337/api/quote", {
      method:'POST',
      headers: {
        'Content-Type':'application/json',
        'x-access-token': localStorage.getItem("token"),
      },
      body:JSON.stringify({
        quote: tempQuote,
      })
    });

    const data = await req.json();

    if (data.status === "ok") {
      setQuote(tempQuote);
      setTempQuote('')
    } else {
      alert(data.error);
    }
  }

  async function logout(){
    localStorage.removeItem('token')
    history('/login')
  }

  return (
    <div>
      <h1>Your Quote :{quote || "No quote found"}</h1>
      <form onSubmit={updateQuote}>
        <input
          type="text"
          placeholder="Quote"
          value={tempQuote}
          onChange={(e) => setTempQuote(e.target.value)}
        />
        <input type="submit" value="update quote"/>
      </form>

      <button onClick={logout}>LogOut</button>
    </div>
  );
};

export default Dashboard;
