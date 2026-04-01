// Module-level storage for scroll positions — survives component unmount/remount
export const scrollPositions = new Map<number, number>();

let _isTabSwitch = false;
export const getIsTabSwitch = () => _isTabSwitch;
export const setIsTabSwitch = (v: boolean) => { _isTabSwitch = v; };
