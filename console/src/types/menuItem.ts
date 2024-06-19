export type MenuItemCategory = 'breakfast' | 'lunch' | 'dinner' | 'beverage';
export type MenuItemAvailabilityStatus = 'available' | 'unavailable';

export interface MenuItem {
    id?: number;
    name: string;
    description: string;
    category: MenuItemCategory;
    price: number;
    availability_status: MenuItemAvailabilityStatus;
}
