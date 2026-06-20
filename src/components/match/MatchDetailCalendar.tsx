import { FixtureCalendarActions } from '../shared/FixtureCalendarActions';
import type { CalendarEventInput } from '../../lib/calendar';

type Props = {
  event: CalendarEventInput;
};

export function MatchDetailCalendar({ event }: Props) {
  return (
    <section className="gc-match-detail-calendar" aria-label="Add match to calendar">
      <FixtureCalendarActions event={event} className="gc-match-detail-calendar__actions" />
    </section>
  );
}
