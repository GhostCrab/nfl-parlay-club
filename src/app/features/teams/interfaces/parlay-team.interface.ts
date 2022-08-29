export interface IParlayTeam {
  teamID: number;
  name: string;
  city: string;
  abbr: string;
  iconURL: string;
  active: boolean;

  isActive(): boolean;
  isPush(): boolean;
  isOU(): boolean;
}

export class ParlayTeam implements IParlayTeam {
  public teamID: number;
  public name: string;
  public city: string;
  public abbr: string;
  public iconURL: string;
  public active: boolean;

  constructor(
    teamID: number,
    city: string,
    name: string,
    abbr: string,
    iconURL: string,
    active: boolean
  ) {
    this.teamID = teamID;
    this.name = name;
    this.city = city;
    this.abbr = abbr;
    this.iconURL = iconURL;
    this.active = active;
  }

  isActive(): boolean {
    return this.active;
  }

  isPush(): boolean {
    return this.name === 'PUSH';
  }

  isOU(): boolean {
    return this.name === 'OVER' || this.name === 'UNDER';
  }
}
