import { Injectable, inject } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Conversation } from "../../../core/message/model/conversation.model";
import { STATUS_ICON_REPOSITORY, IMessageStatusIcon } from "../repository/status-icon.repository";

export type ResolvedStatusIcon = IMessageStatusIcon & { safeSvg?: SafeHtml };

@Injectable({ providedIn: "root" })
export class StatusIconService {
    private sanitizer = inject(DomSanitizer);
    private cache: Record<string, SafeHtml> = {};

    resolve(message: Conversation): ResolvedStatusIcon | null {
        const status = message?.statuses?.[0]?.product_data?.status;
        if (!status) return null;

        const rawIcon = STATUS_ICON_REPOSITORY[status];
        if (!rawIcon) return null;

        if (rawIcon.type === "inline-svg" && rawIcon.svgContent) {
            if (!this.cache[status]) {
                this.cache[status] = this.sanitizer.bypassSecurityTrustHtml(rawIcon.svgContent);
            }
            return { ...rawIcon, safeSvg: this.cache[status] };
        }

        return rawIcon;
    }
}
