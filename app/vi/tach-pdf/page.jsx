import PdfSplitter from '../../../components/PdfSplitter';
import { SiteHeader, SiteFooter } from '../../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Tách PDF Online — Lấy Hoặc Xóa Trang, Miễn Phí & Riêng Tư',
  description:
    'Tách PDF ngay trên trình duyệt: chỉ giữ những trang cần nộp hoặc xóa trang thừa — sao kê, bản scan, hợp đồng. Miễn phí, không upload, file không rời máy bạn.',
  alternates: {
    canonical: '/vi/tach-pdf/',
    languages: { en: '/pdf-splitter/', vi: '/vi/tach-pdf/' },
  },
};

const FAQ = [
  {
    q: 'Lấy vài trang từ một file PDF như thế nào?',
    a: 'Chọn file, để chế độ "Chỉ giữ những trang này", gõ số trang — "1-3, 7" giữ trang 1, 2, 3 và 7 theo đúng thứ tự. Bấm Tách rồi tải file mới về. File gốc không bị đụng đến.',
  },
  {
    q: 'Xóa trang khỏi PDF thì sao?',
    a: 'Chuyển chế độ sang "Xóa những trang này". Mọi trang trừ những trang bạn liệt kê được giữ nguyên thứ tự. Tiện cho việc bỏ trang scan trắng hoặc trang quảng cáo ngân hàng đính cuối sao kê.',
  },
  {
    q: 'PDF của tôi có bị upload lên server không?',
    a: 'Không. Việc tách chạy hoàn toàn trong trình duyệt bằng pdf-lib — sao kê, hợp đồng, giấy tờ tùy thân không rời máy bạn. Trang load xong, ngắt mạng vẫn tách được.',
  },
  {
    q: 'Sao sao kê ngân hàng không tách được?',
    a: 'Nhiều khả năng file có mật khẩu — ngân hàng hay mã hóa sao kê bằng ngày sinh hoặc số tài khoản. Trình duyệt không sửa được PDF mã hóa. Mở bằng mật khẩu, Print → "Save as PDF" để tạo bản không khóa, rồi tách bản đó.',
  },
  {
    q: 'Tách có làm giảm chất lượng không?',
    a: 'Không — trang được sao chép nguyên vẹn, không render lại. Chữ vẫn chọn-copy được, ảnh giữ nguyên độ phân giải. File ra thường nhẹ hơn đơn giản vì ít trang hơn.',
  },
];

export default function Page() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <SiteHeader homeHref="/vi/" langHref="/pdf-splitter/" langLabel="English" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Client-side · file không rời máy bạn</div>
          <h1>Tách PDF Online</h1>
          <p>
            Chỉ giữ những trang cần nộp — hoặc bỏ những trang thừa — miễn phí ngay trên trình duyệt. Bạn đồng hành tự
            nhiên của công cụ Gộp PDF.
          </p>
        </section>

        <PdfSplitter lang="vi" />

        <article className="content">
          <h2>Vì sao cứ phải tách hoài</h2>
          <p>
            Cổng nộp nào cũng đòi trang <em>cụ thể</em>: 3 tháng gần nhất của sao kê 12 tháng, trang chữ ký của hợp
            đồng, 2 payslip trong cả xấp scan. Gửi nguyên file nghĩa là upload chậm, vượt giới hạn dung lượng, và chia
            sẻ nhiều hơn hẳn những gì người ta cần biết về tài chính của bạn. Tách trước vừa lịch sự vừa riêng tư — và
            tách <strong>ngay trên máy</strong> nghĩa là sao kê của bạn không nằm trên server của ai cả.
          </p>
          <h2>Tách, nén, rồi gộp — trọn quy trình</h2>
          <p>
            Vòng lặp làm hồ sơ thường chạy: tách đúng trang cần từ file lớn ở đây, nén các bản scan nặng bằng{' '}
            <Link href="/vi/nen-anh-giay-to/">Nén Ảnh Giấy Tờ</Link>, rồi ghim tất cả thành một file đính kèm gọn gàng
            bằng <Link href="/vi/gop-pdf/">Gộp PDF</Link> theo đúng thứ tự người xét yêu cầu. Ba công cụ, không một
            lần upload.
          </p>
          <h2>Câu hỏi thường gặp</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
          <p className="disclaimer">
            Calcroo tách file để hỗ trợ người dùng — làm theo yêu cầu định dạng và dung lượng trong chính hồ sơ của
            bạn. File xử lý ngay trên trình duyệt, không bao giờ được upload lên Calcroo.
          </p>
        </article>
      </main>
      <SiteFooter vi />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
