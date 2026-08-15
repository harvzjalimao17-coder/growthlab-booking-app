"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Guards the post-booking success screen specifically. If AutomationReveal
 * (or anything under it) throws on an unexpected data shape, the customer
 * still sees a real confirmation instead of a blank panel -- the exact
 * failure mode this was added to close off.
 */
export class BookingErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Booking success screen failed to render:", error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
