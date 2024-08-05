import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-dialog.component.html',
  styleUrl: './filter-dialog.component.scss',
})
export class FilterDialogComponent {
  filters: any = {
    minVolume: null,
    maxVolume: null,
    minPriceChange: null,
    maxPriceChange: null,
    minPrice: null,
    maxPrice: null,
  };
  @Output() applyFiltersEvent = new EventEmitter<any>();

  applyFilters(): void {
    this.applyFiltersEvent.emit(this.filters);
    this.closeDialog();
  }

  closeDialog(event?: MouseEvent): void {
    const dialogRef = document.getElementById('filterDialog');
    if (
      event &&
      (event.target as HTMLElement).id !== 'filterDialog' &&
      dialogRef
    ) {
      dialogRef.style.display = 'none';
    }
    if (dialogRef) {
      dialogRef.style.display = 'none';
    }
  }

  resetFilters(): void {
    this.filters = {
      minVolume: null,
      maxVolume: null,
      minPriceChange: null,
      maxPriceChange: null,
      minPrice: null,
      maxPrice: null,
    };
  }
}
