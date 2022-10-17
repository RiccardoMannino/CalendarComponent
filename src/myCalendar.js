import React, { useState, useRef } from "react";
// import "@fullcalendar/common";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { nanoid } from "nanoid";
import CustomModal from "./Modal";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "./input.css";

let todayStr = new Date().toISOString().replace(/T.*$/, "");

export function Calendario() {
  const [state, setState] = useState({});
  const [currentEvents, setCurrentEvents] = useState([]);
  const [modal, setModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const calendarRef = useRef(null);

  const [title, setTitle] = useState("");
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());

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
      // Open modal create
      console.log("open modal create");
      setStart(selectInfo.start);
      setEnd(selectInfo.end);
      setModal(true);
    }
  }
  function renderEventContent(eventInfo) {
    return (
      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <i>{eventInfo.event.title}</i>
      </div>
    );
  }
  function handleEventClick(clickInfo) {
    setState({ clickInfo, state: "update" });
    // set detail
    setTitle(clickInfo.event.title);
    setStart(clickInfo.event.start);
    setEnd(clickInfo.event.end);

    setModal(true);
  }
  function handleEvents(events) {
    setCurrentEvents(events);
  }
  function handleEventDrop(checkInfo) {
    setState({ checkInfo, state: "spostare" });
    setConfirmModal(true);
  }
  function handleEventResize(checkInfo) {
    // console.log(checkInfo);
    setState({ checkInfo, state: "resize" });
    setConfirmModal(true);
  }
  function handleEdit() {
    state.clickInfo.event.setStart(start);
    state.clickInfo.event.setEnd(end);
    state.clickInfo.event.mutate({
      standardProps: { title },
    });
    handleClose();
  }
  function handleSubmit() {
    const newEvent = {
      id: nanoid(),
      title,
      start: state.selectInfo?.startStr || start.toISOString(),
      end: state.selectInfo?.endStr || end.toISOString(),
      allDay: state.selectInfo?.allDay || false,
    };

    let calendarApi = calendarRef.current.getApi();

    calendarApi.addEvent(newEvent);
    handleClose();
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

  return (
    <div className="container bg glass-component btn">
      <CustomModal
        title={
          state.state === "Aggiorna" ? "Aggiorna Evento" : "Aggiungi Evento"
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
          <p>Titolo Evento</p>
          <input
            type="text"
            name="title"
            placeholder="inserisci evento"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </form>
      </CustomModal>
      {/* <FormGroup>
          <Label for="exampleEmail">From - End</Label>
          <DateRangePicker
            initialSettings={{
              locale: {
                format: "M/DD hh:mm A",
              },
              startDate: start,
              endDate: end,
              timePicker: true,
            }}
            onApply={(event, picker) => {
              setStart(new Date(picker.startDate));
              setEnd(new Date(picker.endDate));
            }}
          >
            <input className="form-control" type="text" />
          </DateRangePicker>
        </FormGroup>
       */}

      <CustomModal
        title={state.state === "resize" ? "Resize Event" : "Sposta Evento"}
        open={confirmModal}
        onClose={() => {
          state.checkInfo.revert();
          setConfirmModal(false);
        }}
        onCancel={() => {
          state.checkInfo.revert();
          setConfirmModal(false);
        }}
        cancelText="Annulla"
        onSubmit={() => setConfirmModal(false)}
        submitText={"OK"}
      >
        <p>Vuoi {state.state} questo evento?</p>
      </CustomModal>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          // left: "myCustomButton prev,today,next",
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
        initialView="timeGridWeek"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        locale="it"
        //
        initialEvents={[
          {
            id: nanoid(),
            title: "Graduation Day",
            start: todayStr,
          },
        ]} // alternatively, use the `events` setting to fetch from a feed
        select={handleDateSelect}
        eventContent={renderEventContent} // custom render function
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        //
        // dateClick={handleDateClick}
        eventAdd={(e) => {
          console.log("eventAdd", e);
        }}
        eventChange={(e) => {
          console.log("eventChange", e);
        }}
        eventRemove={(e) => {
          console.log("eventRemove", e);
        }}
      />
    </div>
  );
}
