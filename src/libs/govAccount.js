// eslint-disable-next-line import/prefer-default-export
export function isGovOfficer(user) {
  const { email } = user
  if (email.includes("dga.or.th")) {
    return true
  }
  return false
}
