import { FixtureCalendarActions } from '../shared/FixtureCalendarActions';
import type { CalendarEventInput } from '../../lib/calendar';

export type PlFixtureCardData = {
  id: string | number;
  homeTeam: string;
  awayTeam: string;
  kickoffUtc: string;
  venue?: string;
  broadcaster?: string;
  matchPageUrl: string;
  status?: 'LIVE' | 'UPCOMING' | 'FT' | string;
  homeScore?: number | null;
  awayScore?: number | null;
  matchweek?: number;
};

type Props = {
  fixture: PlFixtureCardData;
};

const PL_COMPETITION = 'Premier League 2026/27';

function toCalendarEvent(fixture: PlFixtureCardData): CalendarEventInput {
  return {
    homeTeam: fixture.homeTeam,
    awayTeam: fixture.awayTeam,
    kickoffUtc: fixture.kickoffUtc,
    venue: fixture.venue,
    competition: PL_COMPETITION,
    matchPageUrl: fixture.matchPageUrl,
    broadcaster: fixture.broadcaster,
  };
}

export function PlFixtureCard({ fixture }: Props) {
  const calendarEvent = toCalendarEvent(fixture);
  const showScore =
    fixture.homeScore != null &&
    fixture.awayScore != null &&
    fixture.status === 'FT';

  return (
    <article className="gc-pl-fixture-card">
      <header className="gc-pl-fixture-card__meta">
        {fixture.status ? (
          <span className={`gc-pl-fixture-card__status gc-pl-fixture-card__status--${fixture.status.toLowerCase()}`}>
            {fixture.status}
          </span>
        ) : null}
      </header>

      <div className="gc-pl-fixture-card__teams">
        <span className="gc-pl-fixture-card__team">{fixture.homeTeam}</span>
        <span className="gc-pl-fixture-card__score">
          {showScore ? `${fixture.homeScore} - ${fixture.awayScore}` : 'VS'}
        </span>
        <span className="gc-pl-fixture-card__team">{fixture.awayTeam}</span>
      </div>

      <FixtureCalendarActions
        event={calendarEvent}
        className="gc-pl-fixture-card__calendar"
      />
    </article>
  );
}
