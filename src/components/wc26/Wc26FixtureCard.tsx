import { FixtureCalendarActions } from '../shared/FixtureCalendarActions';
import type { CalendarEventInput } from '../../lib/calendar';

export type Wc26FixtureCardData = {
  id: string | number;
  homeTeam: string;
  awayTeam: string;
  kickoffUtc: string;
  venue?: string;
  ukBroadcaster?: string;
  matchPageUrl: string;
  stage?: string;
  group?: string;
  status?: 'LIVE' | 'UPCOMING' | 'FT' | string;
  homeScore?: number | null;
  awayScore?: number | null;
};

type Props = {
  fixture: Wc26FixtureCardData;
};

const WC_COMPETITION = 'FIFA World Cup 2026';

function toCalendarEvent(fixture: Wc26FixtureCardData): CalendarEventInput {
  return {
    homeTeam: fixture.homeTeam,
    awayTeam: fixture.awayTeam,
    kickoffUtc: fixture.kickoffUtc,
    venue: fixture.venue,
    competition: fixture.stage
      ? `${WC_COMPETITION} — ${fixture.stage}`
      : WC_COMPETITION,
    matchPageUrl: fixture.matchPageUrl,
    broadcaster: fixture.ukBroadcaster,
  };
}

export function Wc26FixtureCard({ fixture }: Props) {
  const calendarEvent = toCalendarEvent(fixture);
  const showScore =
    fixture.homeScore != null &&
    fixture.awayScore != null &&
    fixture.status === 'FT';

  return (
    <article className="gc-wc26-fixture-card">
      <header className="gc-wc26-fixture-card__meta">
        {fixture.group ? (
          <span className="gc-wc26-fixture-card__group">Group {fixture.group}</span>
        ) : null}
        {fixture.status ? (
          <span className={`gc-wc26-fixture-card__status gc-wc26-fixture-card__status--${fixture.status.toLowerCase()}`}>
            {fixture.status}
          </span>
        ) : null}
      </header>

      <div className="gc-wc26-fixture-card__teams">
        <span className="gc-wc26-fixture-card__team">{fixture.homeTeam}</span>
        <span className="gc-wc26-fixture-card__score">
          {showScore ? `${fixture.homeScore} - ${fixture.awayScore}` : 'VS'}
        </span>
        <span className="gc-wc26-fixture-card__team">{fixture.awayTeam}</span>
      </div>

      <FixtureCalendarActions
        event={calendarEvent}
        className="gc-wc26-fixture-card__calendar"
      />
    </article>
  );
}
