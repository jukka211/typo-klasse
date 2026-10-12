// Client-side state that survives navigating between the archive and /info
// (resets on a full page reload).
const state = {
  /** The intro plays once, on the first page of a visit. */
  introSeen: false,
  /** Active semester filter, so going Info → Back keeps it. */
  semester: null as string | null,
}

export const introSeen = () => state.introSeen
export const markIntroSeen = () => {
  state.introSeen = true
}

export const rememberedSemester = () => state.semester
export const rememberSemester = (semester: string | null) => {
  state.semester = semester
}
