import DocCompressor from '../../../components/DocCompressor';
import { SiteHeader, SiteFooter } from '../../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Nén Ảnh Giấy Tờ Online — Vừa Giới Hạn Upload immi, Bank, Miễn Phí',
  description:
    'Nén ảnh chụp giấy tờ, bản scan về đúng giới hạn upload — 5MB cho immi, 1–2MB cho ngân hàng và cổng chính phủ — miễn phí ngay trên trình duyệt. File không bao giờ rời máy bạn.',
  alternates: {
    canonical: '/vi/nen-anh-giay-to/',
    languages: {
      en: '/document-compressor/',
      vi: '/vi/nen-anh-giay-to/',
    },
  },
};

const FAQ = [
  {
    q: 'Sao ảnh chụp giấy tờ bằng điện thoại nặng tới 8MB?',
    a: 'Camera điện thoại đời mới chụp 12–48 megapixel — thừa thãi khủng khiếp cho một tờ payslip. Giấy tờ chỉ cần đọc rõ: khoảng 1.500–2.400px cạnh dài với chất lượng JPEG vừa phải là nét trên mọi màn hình, dung lượng thường chỉ 200KB–1MB.',
  },
  {
    q: 'Nén xong giấy tờ có bị mờ chữ không?',
    a: 'Không, ở mức mục tiêu hợp lý. Công cụ giảm dung lượng bằng cách phối hợp thu kích thước và chỉnh chất lượng JPEG, và từ chối hạ dưới ngưỡng chữ còn đọc được — nếu mục tiêu quá nhỏ so với nội dung, nó sẽ báo và đưa bản nhỏ nhất còn rõ chữ thay vì phá nát tài liệu.',
  },
  {
    q: 'ImmiAccount nhận file tối đa bao nhiêu?',
    a: 'Giới hạn phổ biến khoảng 5MB mỗi file, nhưng thay đổi theo từng loại đơn — hãy nhìn giới hạn hiện trong chính hồ sơ của bạn. Preset ≤5MB ở đây dành đúng cho trường hợp đó; nếu cả bộ scan vẫn quá nặng, tách trang hoặc chờ công cụ PDF sắp ra.',
  },
  {
    q: 'Giấy tờ của tôi có bị upload lên server không?',
    a: 'Không. Việc nén chạy hoàn toàn trong trình duyệt bằng Canvas API — file không rời máy bạn. Điều này quan trọng khi tài liệu là hộ chiếu, payslip hay sao kê ngân hàng: đừng đưa chúng cho một trang nén ảnh lạ nào đó chỉ để giảm vài MB. Đóng tab là mọi thứ biến mất.',
  },
  {
    q: 'Ảnh iPhone không load được — vì sao?',
    a: 'Nhiều khả năng là định dạng HEIC của Apple mà đa số trình duyệt ngoài Safari không đọc được. Sửa từ gốc: Settings → Camera → Formats → chọn “Most Compatible” để chụp JPEG, hoặc gửi ảnh cho chính mình qua app chat (app tự chuyển định dạng) rồi lưu bản đó.',
  },
  {
    q: 'Nén PDF ở đây được không?',
    a: 'Chưa — công cụ này xử lý ảnh (JPG, PNG, WebP). Công cụ gộp & nén PDF là mục tiếp theo trong lộ trình; trước mắt, nhiều cổng nộp chấp nhận ảnh JPG nén của từng trang không vấn đề gì.',
  },
];

export default function Page() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <SiteHeader homeHref="/vi/" langHref="/document-compressor/" langLabel="English" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Client-side · file không rời máy bạn</div>
          <h1>Nén Ảnh Giấy Tờ Online</h1>
          <p>
            Thu nhỏ ảnh chụp giấy tờ, bản scan về đúng giới hạn upload — immi, Centrelink, ngân hàng, email — miễn phí
            trên trình duyệt, giấy tờ của bạn không bao giờ chạm đến server của chúng tôi.
          </p>
        </section>

        <DocCompressor lang="vi" />

        <article className="content">
          <h2>Bài toán giới hạn upload, giải đúng cách</h2>
          <p>
            Cổng nộp nào cũng có trần dung lượng, camera điện thoại nào cũng vượt trần, và các &quot;mẹo&quot; quen
            thuộc đều dở: tự email cho mình (hên xui chất lượng), chụp màn hình (mất độ phân giải), hoặc upload bản
            scan hộ chiếu lên một trang nén ảnh lạ hoắc (một quyết định riêng tư mà bạn không nên phải đưa ra). Công
            cụ này làm đúng bài: chọn giới hạn, nó tự tìm tổ hợp kích thước + chất lượng JPEG tốt nhất chui vừa dưới
            trần — <strong>ngay trên máy bạn</strong>.
          </p>

          <h2>Chọn mục tiêu nào?</h2>
          <ul>
            <li><strong>≤ 5MB:</strong> trần phổ biến cho file đính kèm hồ sơ visa kiểu ImmiAccount.</li>
            <li><strong>≤ 1–2MB:</strong> thường gặp ở cổng vay ngân hàng, dịch vụ liên kết myGov, hệ thống nộp đơn xin việc.</li>
            <li><strong>≤ 500KB:</strong> an toàn khi đính kèm email nhiều file và các form chính phủ đời cũ.</li>
            <li><strong>≤ 100–250KB:</strong> ảnh hồ sơ, web form giới hạn gắt.</li>
          </ul>
          <p>
            Một thói quen nên giữ: nén ra <em>bản sao</em> để nộp, còn ảnh gốc chất lượng đầy đủ thì lưu lại — nén lại
            lúc nào cũng được, nhưng không có đường &quot;giải nén ngược&quot;.
          </p>

          <h2>Mẹo chụp đẹp hơn mọi công cụ nén</h2>
          <p>
            Ảnh gốc tốt vừa nén nhỏ hơn vừa dễ đọc hơn: đặt giấy phẳng dưới ánh sáng đều (tắt flash tránh lóa), chụp
            đầy khung, giữ điện thoại song song mặt giấy, và tận dụng chế độ scan có sẵn (Notes trên iPhone, Google
            Drive scan) — chúng tự làm phẳng và làm nét chữ trước cả khi bạn đem vào đây.
          </p>

          <h2>Câu hỏi thường gặp</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p>
            Đang chuẩn bị hồ sơ visa? Chỉnh ảnh chuẩn với <Link href="/vi/chinh-anh-visa-uc/">Chỉnh Ảnh Visa</Link>,
            và lo phần tiền bạc với <Link href="/vi/tinh-hoan-thue-uc/">Tính Hoàn Thuế</Link>.
          </p>

          <p className="disclaimer">
            Calcroo nén file để hỗ trợ người dùng — giới hạn upload và yêu cầu tài liệu do từng cổng nộp quy định và
            thay đổi theo thời gian; luôn làm theo hướng dẫn trong chính hồ sơ của bạn. File xử lý ngay trên trình
            duyệt, không bao giờ được upload lên Calcroo.
          </p>
        </article>
      </main>
      <SiteFooter vi />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
