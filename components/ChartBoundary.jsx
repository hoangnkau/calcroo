'use client';

import { Component } from 'react';

/* Bắt lỗi khi thư viện chart (Chart.js / react-chartjs-2) hoặc chunk
   động của nó không tải/không render được — hiển thị fallback thay vì
   làm hỏng cả trang. */
export default class ChartBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    if (typeof console !== 'undefined') console.error('[Calcroo] chart failed to load', error);
  }

  render() {
    if (this.state.failed) return this.props.fallback || null;
    return this.props.children;
  }
}
