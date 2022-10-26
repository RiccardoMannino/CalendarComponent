import React, { useState, useRef, useEffect } from "react";
// import "@fullcalendar/common";
import FullCalendar from "@fullcalendar/react";
import {Calendar} from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import { nanoid } from "nanoid";
import CustomModal from "./Modal";
import "./input.css";
import axios from "axios";

let todayStr = new Date().toISOString().replace(/T.*$/, "");

export function Calendario() {
  const [state, setState] = useState({});
  const [currentEvents, setCurrentEvents] = useState([]);
  const [color, setColor] = useState("");
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventi, setEventi] = useState([])
  const calendarRef = useRef(null);

  function fetchEventi() {
      fetch("http://localhost:1337/api/eventi")
      .then((res) => res.json())
      .then(res => setEventi(res.data))
      .then((res) => console.log(res))
  }
  
  useEffect(() => {
    fetchEventi();
  }, [])
  
  useEffect(() => {
    console.log(eventi);
  }, [eventi])

  const handleCloseModal = () => {
    handleClose();
    setModal(false);
  };

  function handleDateSelect(selectInfo) {
    if (selectInfo.view.calendar) {
      selectInfo.view.calendar.unselect();
      setState({
        selectInfo,
        state: "creare",
      });

      setModal(true);
    }
  }

  function renderEventContent(eventInfo) {

    return (
      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          background: `${eventInfo.event.color}`,
        }}
      >
        <i>{eventInfo.event.title}</i>
      </div>
    );
  }

  function handleEventClick(clickInfo) {
    setState({ clickInfo, state: "Aggiorna" });
    // set detail
    setTitle(clickInfo.event.title);
    setStart(clickInfo.event.start);
    setEnd(clickInfo.event.end);
    setModal(true);
  }

  function handleEvents(events) {
    setCurrentEvents(events);
  }

  function handleEdit(e) {
    e.preventDefault();

    // state.clickInfo.event.setStart(start);
    // state.clickInfo.event.setEnd(end);
    
    console.log(state.clickInfo.event);
    
    state.clickInfo.event.mutate({
      standardProps: {
        title,
      },
    });

    setColor('');
    handleClose();
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!title) {
      return;
    }

    const newEvent = {
      id: nanoid(),
      title,
      color,
      start: state.selectInfo?.startStr, 
      end: state.selectInfo?.endStr, 
      allDay: state.selectInfo?.allDay || false,
    };

    let calendarApi = calendarRef.current.getApi();

    calendarApi.addEvent(newEvent);
    setColor("");
    handleClose();
      fetch("http://localhost:1337/api/eventi", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          data: {
            titolo: newEvent.title,
            colore: newEvent.color,
            oraInizio: newEvent.start,
            oraFine: newEvent.end,
            tuttoGiorno: newEvent.allDay
          }
        })
      })
      .then((res) => {
        console.log(res);
      })
  }

  function handleDelete() {
    state.clickInfo.event.remove();
    handleClose();
  }

  function handleClose() {
    setTitle("");
    setStart(new Date());
    setEnd(new Date());
    setState({});
    setModal(false);
  }

  function handleChange(e) {
    if (color === "" && e.target.name === "rosso") {
      setColor("#FF0000");
    } else if (color === "" && e.target.name === "verde") {
      return setColor("#00ff00");
    } else if (color === "" && e.target.name === "giallo") {
      setColor("#ffff00");
    } else {
      setColor("");
    }
  }

  return (
    <div className="sd:container bg glass-component box-bg">
      <CustomModal
        title={
          state.state === "Aggiorna" ? (
            "Aggiorna Evento"
          ) : (
            <p className="text-[#5d5d5d] mb-3">Aggiungi Evento</p>
          )
        }
        open={modal}
        onClose={handleCloseModal}
        onCancel={handleCloseModal}
        onSubmit={state.clickInfo ? handleEdit : handleSubmit}
        submitText={state.clickInfo ? "Aggiorna" : "Salva"}
        onDelete={state.clickInfo && handleDelete}
        deleteText="Cancella"
      >
        <form onSubmit={state.clickInfo ? handleEdit : handleSubmit}>
          <p className="text-[#5d5d5d] mb-3">Titolo Evento</p>
          <input
            className="text-[#5d5d5d] rounded-md indent-1"
            type="text"
            name="title"
            placeholder="inserisci evento"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <input
            className="accent-red-700 mt-2 mr-1"
            type="checkbox"
            onChange={(e) => handleChange(e)}
            name="rosso"
          />
          <span className="mr-1">Rosso</span>
          <input
            className="accent-green-700 mt-2 mr-1"
            type="checkbox"
            onChange={(e) => handleChange(e)}
            name="verde"
          />
          <span className="mr-1">Verde</span>
          <input
            className="accent-yellow-500 mt-2 mr-1"
            type="checkbox"
            onChange={(e) => handleChange(e)}
            name="giallo"
          />
          <span>Giallo</span>
        </form>
      </CustomModal>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, googleCalendarPlugin]}
        googleCalendarApiKey= "AIzaSyD1yLDSQM8RJMABDiyI3xVaRiYt1CAQ6Do"
        headerToolbar={{
          left: "prev,today,next",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        buttonText={{
          today: "corrente",
          month: "mese",
          week: "settimana",
          day: "giorno",
          list: "list",
        }}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        locale="it"
        events={
          eventi?.map(evento => (
            {
              id: nanoid(),
              title: evento.attributes.titolo,
              color: evento.attributes.colore,
              start: evento.attributes.oraInizio,
              end: evento.attributes.oraFine,
              allDay: evento.attributes.tuttoGiorno
          }
          ))
        } // alternatively, use the `events` setting to fetch from a feed
        select={handleDateSelect}
        eventContent={renderEventContent} // custom render function
        eventClick={handleEventClick}
        //dateClick={handleDateClick}
      />
    </div>
  );
}
