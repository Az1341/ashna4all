'use client';

import {
  buildGoogleCalendarUrl,
  downloadIcsFile,
  type CalendarEventInput,
} from '../../lib/calendar';

type Props = {
  event: CalendarEventInput;
  className?: string;
};

export function FixtureCalendarActions({ event, className }: Props) {
  const googleUrl = buildGoogleCalendarUrl(event);

  return (
    <div className={className ?? 'gc-fixture-calendar'}>
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="gc-cal-link gc-cal-link-google"
      >
        Add to Google Calendar
      </a>
      <button
        type="button"
        className="gc-cal-link gc-cal-link-ics"
        onClick={() => downloadIcsFile(event)}
      >
        Download .ics
      </button>
    </div>
  );
}
