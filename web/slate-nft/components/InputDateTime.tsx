import clsx from 'clsx'
import type { DateTimePickerProps } from 'react-datetime-picker/dist/entry.nostyle'
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle'
import { FaCalendar, FaTimes } from 'react-icons/fa'

export const InputDateTime = ({ className, ...rest }: DateTimePickerProps) => {
  return (
    <DateTimePicker
      calendarIcon={<FaCalendar className="text-black hover:text-black/80" />}
      className={clsx(
        'bg-white/10 rounded border-2 border-black/20 form-input',
        'placeholder:text-black/50',
        'focus:ring focus:ring-plumbus-20',
        className,
      )}
      clearIcon={<FaTimes className="text-plumbus-40 hover:text-plumbus-60" />}
      {...rest}
    />
  )
}
