import React, { useState, useRef } from 'react'
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils';
import Modal from './Modal';
import "./input.css" 


export default function Calendario() {

  const [showModal, setShowModal] = useState(false);
  const [eventi, setEventi] = useState([])
    
    return (
      <div>
        <FullCalendar
            plugins= {[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }} 
            initialView= "dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            initialEvents={INITIAL_EVENTS} 
            eventsSet={handleEvents}
            eventContent={renderEventContent}
        />
        <Modal props = {{ showModal, setShowModal }} />
      </div>
    );

    function handleDateSelect(selectInfo) {
        
        let title = openModal()
        let calendarApi = selectInfo.view.calendar
    
        calendarApi.unselect() // clear date selection
    
        if (title) {
          calendarApi.addEvent({
            id: createEventId(),
            title,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay
          })
        }
      }
    
    function handleEventClick(clickInfo) {
        if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
          clickInfo.event.remove()
        }
      }

    function handleEvents(events) {
        setEventi(
          events
        )
      }

      function renderEventContent(eventInfo) {
        return (
          <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
          </>
        )
      }
    
      function openModal() {
        setShowModal(true)
        let titolo = "ciao"
        return titolo
      }
}
