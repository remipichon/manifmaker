export class TeamService {
  static optionQueryTeamsWithoutAlreadyAssigned() {
    return {
      name: {
        $not: ASSIGNMENTREADYTEAM
      }
    }
  }
}