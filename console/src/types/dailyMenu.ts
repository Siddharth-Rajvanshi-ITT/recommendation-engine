export interface DailyMenu {
    menu_id: number;
    menu_date: Date;
    menu_type: 'breakfast' | 'lunch' | 'dinner';
    chef_id: number;
}