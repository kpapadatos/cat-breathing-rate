import { Component, computed, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isSessionActive = signal(false);
  bpm = computed(() => {
    const firstClickTimestampMs = this.firstClickTimestampMs();
    const lastClickTimestampMs = this.lastClickTimestampMs();

    if (firstClickTimestampMs === null || lastClickTimestampMs === null) {
      return '0';
    } else {
      const durationMs = lastClickTimestampMs - firstClickTimestampMs;

      return (this.clickCount() / (durationMs / 60000)).toFixed(0);
    }
  });
  firstClickTimestampMs = signal<number | null>(null);
  lastClickTimestampMs = signal<number | null>(null);
  clickCount = signal(0);
  timeoutId: number | null = null;
  @HostListener('click')
  onClick() {
    if (!this.isSessionActive()) {
      this.isSessionActive.set(true);
      this.clickCount.set(0);
      this.firstClickTimestampMs.set(performance.now());
    } else {
      this.lastClickTimestampMs.set(performance.now());

      this.clickCount.set(this.clickCount() + 1);
    }

    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.isSessionActive.set(false);
    }, 5000) as any;
  }
}
