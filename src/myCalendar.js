import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import CustomModal from "./Modal";
import "./input.css";

export function Calendario() {
  const [state, setState] = useState({});
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("");
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [allDay, setAllDay] = useState(false);
  const [eventi, setEventi] = useState([]);
  const [modal, setModal] = useState(false);
  const calendarRef = useRef(null);

  //FETCH EVENTI METHOD GET
  function fetchEventi() {
    fetch("http://localhost:1337/api/eventi")
      .then((res) => res.json())
      .then((res) => setEventi(res.data));
  }

  //RENDER EVENTI ALL'APERTURA
  useEffect(() => {
    fetchEventi();
  }, []);

  //CHIUSURA E RESET MODALE
  function handleClose() {
    setTitle("");
    setColor("");
    setStart(new Date());
    setEnd(new Date());
    setAllDay(false);
    setState({});
    setModal(false);
  }

  //SELEZIONA DATA CREAZIONE EVENTO
  function handleDateSelect(selectInfo) {
    if (selectInfo.view.calendar) {
      console.log(selectInfo.view.calendar);
      selectInfo.view.calendar.unselect();
      setStart(selectInfo.startStr);
      setEnd(selectInfo.endStr);
      setModal(true);
      setAllDay(selectInfo.allDay);
      console.log(selectInfo);
    }
  }

  //RENDERIZZAZIONE EVENTI
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

  //AGGIORNAMENTO EVENTI
  function handleEventClick(clickInfo) {
    console.log(color);
    setState({ clickInfo, state: "Aggiorna" });
    setTitle(clickInfo.event.title);
    setColor(clickInfo.event.backgroundColor);
    setStart(clickInfo.event.start);
    setEnd(clickInfo.event.end);
    setAllDay(clickInfo.event.allDay);
    setModal(true);
    console.log(clickInfo);
  }

  //MODIFICA EVENTO + FETCH METHOD PUT
  function handleEdit(e) {
    e.preventDefault();
    fetch(`http://localhost:1337/api/eventi/${state.clickInfo.event.id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        data: {
          titolo: title,
          colore: color,
          oraInizio: start,
          oraFine: end,
          tuttoGiorno: allDay,
        },
      }),
    }).then(fetchEventi);

    handleClose();
  }

  //INVIO EVENTI + METHOD POST
  function handleSubmit(e) {
    e.preventDefault();

    if (!title) {
      return;
    }

    fetch("http://localhost:1337/api/eventi", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        data: {
          titolo: title,
          colore: color,
          oraInizio: start,
          oraFine: end,
          tuttoGiorno: allDay,
        },
      }),
    })
      .then(fetchEventi)
      .then(handleClose);
  }

  //FETCH ELIMINA EVENTI
  function handleDelete() {
    fetch(`http://localhost:1337/api/eventi/${state.clickInfo.event.id}`, {
      method: "DELETE",
    }).then(fetchEventi);
    handleClose();
  }

  useEffect(() => {
    console.log(state);
  });
  //RIDIMENSIONAMENTO EVENTI (FETCH METHOD PUT)
  function handleEventDropAndResize(checkInfo) {
    setState({ checkInfo, state: "resize" });

    fetch(`http://localhost:1337/api/eventi/${checkInfo.event.id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        data: {
          titolo: checkInfo.event.title,
          colore: checkInfo.event.backgroundColor,
          oraInizio: checkInfo.event.start,
          oraFine: checkInfo.event.end,
          tuttoGiorno: checkInfo.event.allDay,
        },
      }),
    }).then(fetchEventi);
    handleClose();
  }

  //CAMBIO VALORE COLOR TRAMITE I TRE INPUT
  function handleChange(e) {
    if (e.target.checked) {
      setColor(e.target.value);
    } else {
      setColor("");
    }
  }

  //RENDERIZZAZIONE INPUT
  const inputs = ["#D50000", "#E67C73", "#F4511E", "#F6BF26", "#33B679", "#0B8043", "#3F51B5", "#655B68"];
  const listInputs = inputs.map((inputcolor, index) => (
    <input
      key={index}
      className="option-input"
      style={{ backgroundColor: inputcolor }}
      type="radio"
      value={inputcolor}
      name="colore"
      onChange={(e) => handleChange(e)}
    />
  ));

  return (
    <div className="sd:container bg glass-component box-bg">
      {/* MODALE PER AGGIUNGERE/AGGIORNARE EVENTI */}
      <CustomModal
        title={
          state.state === "Aggiorna" ? (
            "Aggiorna Evento"
          ) : (
            <p className="text-[#5d5d5d] mb-3">Aggiungi Evento</p>
          )
        }
        open={modal}
        onClose={handleClose}
        onCancel={handleClose}
        onSubmit={state.clickInfo ? handleEdit : handleSubmit}
        submitText={state.clickInfo ? "Aggiorna" : "Salva"}
        onDelete={state.clickInfo && handleDelete}
        deleteText="Cancella"
      >
        <form onSubmit={state.clickInfo ? handleEdit : handleSubmit}>
          <p className="text-[#5d5d5d] mb-3">Titolo Evento</p>
          <input
            className="text-[#5d5d5d] w-full rounded-md indent-1"
            type="text"
            name="title"
            placeholder="inserisci evento"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <div className="flex-box my-4">{listInputs}</div>
        </form>
      </CustomModal>

      {/* CALENDARIO */}

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          right: "prev,today,next dayGridMonth,timeGridWeek,timeGridDay",
          left: "title",
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
        events={eventi?.map((evento) => ({
          id: evento.id,
          title: evento.attributes.titolo,
          color: evento.attributes.colore,
          start: evento.attributes.oraInizio,
          end: evento.attributes.oraFine,
          allDay: evento.attributes.tuttoGiorno,
        }))} // EVENTI CARICATI DAL DATABASE
        select={handleDateSelect}
        eventContent={renderEventContent} // RENDERIZZAZIONE E PERSONALIZZAZIONE EVENTI
        eventClick={handleEventClick}
        eventResize={handleEventDropAndResize}
        eventDrop={handleEventDropAndResize}
      />
    </div>
  );
}
