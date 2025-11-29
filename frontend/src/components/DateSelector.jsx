import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import "react-day-picker/dist/style.css";

const DateSelector = ({ date, setDate }) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);

  return (
    <div className="relative">
      {/* Button to open DatePicker */}
      <button
        type="button"
        className="inline-flex items-center gap-2 text-[13px] font-medium text-blue-900 bg-sky-200/40 hover:bg-sky-200/70 rounded-sm px-2 py-1 cursor-pointer"
        onClick={() => setOpenDatePicker(!openDatePicker)}
      >
        <MdDateRange className="text-lg" />
        {date ? moment(date).format("Do MMM YYYY") : moment().format("Do MMM YYYY")}
      </button>

      {/* DatePicker */}
      {openDatePicker && (
        <div className="absolute top-full left-0 mt-2 p-5 bg-sky-50/80 rounded-lg shadow-lg z-50">
          {/* Close button */}
          <button
            type="button"
            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-sky-100 hover:bg-sky-200"
            onClick={() => setOpenDatePicker(false)}
          >
            <IoMdClose className="text-xl text-blue-900" />
          </button>

          <DayPicker
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              setDate(selectedDate);
              setOpenDatePicker(false);
            }}
            captionLayout="dropdown"
            pagedNavigation
          />
        </div>
      )}
    </div>
  );
};

export default DateSelector;
