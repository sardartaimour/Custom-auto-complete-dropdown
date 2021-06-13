import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortalDirective } from '@angular/cdk/portal';
import { AfterViewInit, Component, ElementRef, forwardRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';


@Component({
	selector: 'auto-complete-dp',
	templateUrl: './auto-complete-dp.component.html',
	styleUrls: ['./auto-complete-dp.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => AutoCompleteDpComponent),
			multi: true
		},
		// CustomDropdownService
	]
})
export class AutoCompleteDpComponent implements OnInit, AfterViewInit, ControlValueAccessor  {

	@Input() selected: any;
	@Input() options: any[];
	@Input() required: boolean;
	@Input() disabled: boolean;
	@Input() placeholder: string;

	isOpen: boolean;
	optionsCopy: any[];
	selectedOption: any;
	displayValue: string;
	overlayRef: OverlayRef;

	@ViewChild('panelTemRef') panelTemRef: ElementRef;
	@ViewChild('searchInput', { read: ElementRef }) searchInput: ElementRef;
	@ViewChild(TemplatePortalDirective) contentTemplate: TemplatePortalDirective;

	@HostListener('window:resize')
	onWinResize() {
		this.resizePanel();
	}

	constructor(private overlay: Overlay) {

		this.options = [];
		this.isOpen = false;
		this.selected = null;
		this.required = false;
		this.disabled = false;
		this.optionsCopy = [];
		this.displayValue = null;
		this.selectedOption = null;
		this.placeholder = 'Custom Drop Down';
	}
	
	ngOnInit(): void 
	{
		this.options = [
			{ id: 1, car: 'Audi Q3 Quattro Sport' },
			{ id: 2, car: 'Ford Escape' },
			{ id: 3, car: 'Kia Sorento' },
			{ id: 4, car: 'Lexus RX' },
			{ id: 5, car: 'Suzuki Grand Vitara' },
			{ id: 6, car: 'Toyota Fortuner' },
			{ id: 7, car: 'Mazda CX-7' },
			{ id: 8, car: 'Honda HR-V' },
			{ id: 9, car: 'Nissan Murano' },
			{ id: 10, car: 'Acura MDX' }
		];

		this.optionsCopy = [...this.options];
	}

	ngAfterViewInit(): void {
		fromEvent(this.searchInput.nativeElement, 'keyup')
			.pipe(
				// get value
				map((event: any) => { return event.target.value; }),
				// // if character length greater then 2
				// , filter(res => res.length > 0)

				// Time in milliseconds between key events
				debounceTime(400),
				distinctUntilChanged()

				// subscription for response
			)
			.subscribe((query: string) => {
				this.searchTermChanged(query);
			});
	}

	onChangeFn = (_: any) => {};
 
  	onTouchedFn = () => {};

	writeValue(obj: any): void 
	{
		this.selected = obj;
		const ft = this.options.filter(opt => opt['id'] === this.selected);
		this.selectedOption = ft && ft.length > 0 ? ft[0] : null;
		this._displayValue = this.selectedOption;
	}

	registerOnChange(fn: any): void 
	{
		this.onChangeFn = fn;
	}

	registerOnTouched(fn: any): void 
	{
		this.onTouchedFn = fn;
	}

	setDisabledState?(isDisabled: boolean): void 
	{
		this.disabled = isDisabled;
	}

	onTouched(): void
	{
		this.onTouchedFn();
	}
	 
	onChange(): void
	{
		this.onChangeFn(this.selected);
	}

	onOpenPanel(): void 
	{
		if (!this.isOpen) {
			this.overlayRef = this.overlay.create(this.getOverlayConfig());
			this.overlayRef.attach(this.contentTemplate);
			this.resizePanel();
			this.overlayRef.backdropClick().subscribe(() => this.onClosePanel());
			this.isOpen = true;
		}
		else {
			this.onClosePanel();
		}
	}

	onClosePanel(): void {
		this.options = [...this.optionsCopy];
		this.overlayRef.detach();
		this.isOpen = false;
	}

	onSelectOption(option: any): void 
	{
		this._displayValue = option;
		this.selectedOption = option;
		this.selected = option['id'];
		this.onClosePanel();
		this.onChange();
	}

	searchTermChanged(query: string): void {
		this.options = [...this.optionsCopy];
		if (query) {
			this.options = this.optionsCopy.filter(opt => opt['car'].toLowerCase().includes(query.toLowerCase()));
		}
		else {
			this._displayValue = null;
			this.selectedOption = null;
			this.selected = null;
			this.onChange();
		}
	}

	private resizePanel(): void {
		if (!this.overlayRef) {
			return;
		}

		const tempRef = this.panelTemRef.nativeElement.getBoundingClientRect();
		this.overlayRef.updateSize({ width: tempRef.width });
	}

	private getOverlayConfig(): OverlayConfig {
		const positionStrategy = this.overlay.position()
			.flexibleConnectedTo(this.panelTemRef)
			.withPush(false)
			.withPositions([{
				originX: 'start',
				originY: 'bottom',
				overlayX: 'start',
				overlayY: 'top'
			}, {
				originX: 'start',
				originY: 'top',
				overlayX: 'start',
				overlayY: 'bottom'
			}]);

		return new OverlayConfig({
			positionStrategy: positionStrategy,
			hasBackdrop: true,
			backdropClass: 'cdk-overlay-transparent-backdrop'
		});
	}

	set _displayValue(selectedOption: any) 
	{
		this.displayValue = selectedOption ? selectedOption['car'] : null;
	}
}
