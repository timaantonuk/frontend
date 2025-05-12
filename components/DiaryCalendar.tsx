'use client';

import '../app/styles/calendar.css';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

function DiaryCalendar() {
  const [value, onChange] = useState<Value>(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="calendar-placeholder">Загрузка календаря...</div>;
  }

  return (
    <div>
      <Calendar onChange={onChange} value={value} />
    </div>
  );
}

export default DiaryCalendar;
