import { ref, computed } from '@vue/composition-api';

export function usePagination(maxPerPage: number, list: any) {
  const page = ref(1);
  const maxPage = computed(() => Math.floor(list.value.length / maxPerPage) + 1);
  const visibleList = computed(() => list.value.slice(page.value * maxPerPage - maxPerPage, page.value * maxPerPage));
  return {
    page: 1,
    maxPage,
    visibleList,
  };
}
