export function calculatePagination(page_size: number, page: number) {
    let start = ((page - 1) * page_size)
    let end = page * page_size

    return {start, end}
}