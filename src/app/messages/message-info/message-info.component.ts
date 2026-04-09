import { Component, HostListener, Input, inject } from "@angular/core";
import { Conversation } from "../../../core/message/model/conversation.model";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { StatusIconService, ResolvedStatusIcon } from "../../common/service/status-icon.service";

@Component({
    selector: "app-message-info",
    imports: [CommonModule, MatIconModule, MatTooltipModule],
    templateUrl: "./message-info.component.html",
    styleUrl: "./message-info.component.scss",
    standalone: true,
})
export class MessageInfoComponent {
    @Input() message!: Conversation;
    @Input() sent = true;

    showErrorModal = false;
    private statusIconService = inject(StatusIconService);

    protected getStatusIcon(message: Conversation): ResolvedStatusIcon | null {
        return this.statusIconService.resolve(message);
    }

    get error() {
        return this.message?.statuses?.[0]?.product_data?.errors?.[0] ?? null;
    }

    toggleErrorModal() {
        this.showErrorModal = !this.showErrorModal;
    }

    closeErrorModal() {
        this.showErrorModal = false;
    }

    @HostListener("window:keydown.shift.escape", ["$event"])
    private closeOnShiftEscape(event: KeyboardEvent) {
        event.preventDefault();
        this.closeErrorModal();
    }
}
