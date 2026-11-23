import { describe, expect, it } from 'vitest';

import { DEFAULT_SETTINGS, type RollSettings } from '../../roll/lib/roll.ts';
import { decodeShareQuery, encodeShareQuery } from './shareUrl.ts';

const SAVED_SETTINGS: RollSettings = { selector: 'good', modifierCount: 5, partySize: 3 };

describe('encodeShareQuery', () => {
  it('writes the short share format from the contract', () => {
    const query = encodeShareQuery({
      result: { heroIds: ['sc', 'ju'], modifierIds: ['ql', 'co', 'in'] },
      settings: { selector: 'both', modifierCount: 3, partySize: 2 },
    });

    expect(query).toBe('h=scju&m=qlcoin&t=a&n=3&p=2');
  });

  it('writes g and b for the good and bad selectors and leaves out empty card lists', () => {
    expect(
      encodeShareQuery({
        result: { heroIds: ['sc'], modifierIds: [] },
        settings: { selector: 'good', modifierCount: 1, partySize: 1 },
      }),
    ).toBe('h=sc&t=g&n=1&p=1');
    expect(
      encodeShareQuery({
        result: { heroIds: ['sc'], modifierIds: ['id'] },
        settings: { selector: 'bad', modifierCount: 1, partySize: 1 },
      }),
    ).toBe('h=sc&m=id&t=b&n=1&p=1');
    expect(
      encodeShareQuery({
        result: { heroIds: [], modifierIds: ['ql', 'co'] },
        settings: { selector: 'both', modifierCount: 2, partySize: 1 },
      }),
    ).toBe('m=qlco&t=a&n=2&p=1');
  });
});

describe('decodeShareQuery', () => {
  it('reads the contract example', () => {
    expect(decodeShareQuery('?h=scju&m=qlcoin&t=a&n=3&p=2', SAVED_SETTINGS)).toEqual({
      result: { heroIds: ['sc', 'ju'], modifierIds: ['ql', 'co', 'in'] },
      settings: { selector: 'both', modifierCount: 3, partySize: 2 },
    });
  });

  it('round-trips an encoded roll', () => {
    const roll = {
      result: { heroIds: ['ki', 'mr', 'pp', 'wu'], modifierIds: ['es', 'bf', 'rs', 'di', 'ch'] },
      settings: { selector: 'both', modifierCount: 5, partySize: 4 },
    } as const;

    expect(decodeShareQuery(encodeShareQuery(roll), DEFAULT_SETTINGS)).toEqual(roll);
  });

  it('reads a link with only heroes or only modifiers', () => {
    expect(decodeShareQuery('h=scju&t=a&n=5&p=2', SAVED_SETTINGS)).toEqual({
      result: { heroIds: ['sc', 'ju'], modifierIds: [] },
      settings: { selector: 'both', modifierCount: 5, partySize: 2 },
    });
    expect(decodeShareQuery('m=qlco&t=a&n=2&p=1', SAVED_SETTINGS)).toEqual({
      result: { heroIds: [], modifierIds: ['ql', 'co'] },
      settings: { selector: 'both', modifierCount: 2, partySize: 1 },
    });
  });

  it('drops unknown IDs and keeps the valid ones', () => {
    const { result } = decodeShareQuery('h=scxxju&m=zzqlco', SAVED_SETTINGS);

    expect(result).toEqual({ heroIds: ['sc', 'ju'], modifierIds: ['ql', 'co'] });
  });

  it('drops duplicate IDs', () => {
    const { result } = decodeShareQuery('h=scscju&m=qlqlco', SAVED_SETTINGS);

    expect(result).toEqual({ heroIds: ['sc', 'ju'], modifierIds: ['ql', 'co'] });
  });

  it('drops the later modifier of a conflicting pair', () => {
    expect(decodeShareQuery('m=seqles', SAVED_SETTINGS).result.modifierIds).toEqual(['se', 'ql']);
  });

  it('ignores the trailing character of an odd-length ID string', () => {
    const { result } = decodeShareQuery('h=scj&m=qlc', SAVED_SETTINGS);

    expect(result).toEqual({ heroIds: ['sc'], modifierIds: ['ql'] });
  });

  it('keeps at most a full party of heroes', () => {
    expect(decodeShareQuery('h=scjuroalme', SAVED_SETTINGS).result.heroIds).toEqual([
      'sc',
      'ju',
      'ro',
      'al',
    ]);
  });

  it('keeps at most five modifiers, the game cap', () => {
    expect(decodeShareQuery('m=qlcoindiabsf', SAVED_SETTINGS).result.modifierIds).toEqual([
      'ql',
      'co',
      'in',
      'di',
      'ab',
    ]);
  });

  it('clamps out-of-range numbers', () => {
    expect(decodeShareQuery('t=a&n=6&p=9', SAVED_SETTINGS).settings).toEqual({
      selector: 'both',
      modifierCount: 5,
      partySize: 4,
    });
    expect(decodeShareQuery('t=b&n=0&p=0', SAVED_SETTINGS).settings).toEqual({
      selector: 'bad',
      modifierCount: 1,
      partySize: 1,
    });
  });

  it('keeps the saved settings for missing or malformed settings', () => {
    expect(decodeShareQuery('h=sc&t=x&n=two&p=-1', SAVED_SETTINGS).settings).toEqual(
      SAVED_SETTINGS,
    );
    expect(decodeShareQuery('h=sc', SAVED_SETTINGS).settings).toEqual(SAVED_SETTINGS);
  });

  it('clamps an out-of-range saved count', () => {
    const saved: RollSettings = { selector: 'both', modifierCount: 15, partySize: 1 };

    expect(decodeShareQuery('t=b', saved).settings.modifierCount).toBe(5);
  });

  it('returns an empty result when nothing is valid', () => {
    expect(decodeShareQuery('h=zz&m=x&foo=bar', SAVED_SETTINGS)).toEqual({
      result: { heroIds: [], modifierIds: [] },
      settings: SAVED_SETTINGS,
    });
    expect(decodeShareQuery('', SAVED_SETTINGS).result).toEqual({ heroIds: [], modifierIds: [] });
  });
});
