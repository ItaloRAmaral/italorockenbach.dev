/** Lets any component open the palette without threading state through a
 *  provider — the trigger buttons live in the sidebar and the mobile bar, far
 *  from where the palette is mounted. */
export const SEARCH_OPEN_EVENT = "record:open-search";

export function openSearch() {
  document.dispatchEvent(new Event(SEARCH_OPEN_EVENT));
}
