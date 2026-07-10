import PhotoResizer from '../../../components/PhotoResizer';
import { SiteHeader, SiteFooter } from '../../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Chỉnh Ảnh Visa Úc Online — Chuẩn 35×45mm, Miễn Phí',
  description:
    'Crop và resize ảnh đúng chuẩn hộ chiếu/visa Úc 35×45mm (413×531px) ngay trên trình duyệt, miễn phí. Ảnh không upload đi đâu. Tải ảnh đơn hoặc khổ in 6×4″ gồm 4 ảnh, in ở Kmart chưa tới 1 đô.',
  alternates: {
    canonical: '/vi/chinh-anh-visa-uc/',
    languages: {
      en: '/visa-photo-resizer/',
      vi: '/vi/chinh-anh-visa-uc/',
    },
  },
};

const FAQ = [
  {
    q: 'Ảnh visa Úc kích thước bao nhiêu?',
    a: 'Chuẩn Úc là 35mm × 45mm, khuôn mặt (cằm đến đỉnh đầu) chiếm 32–36mm chiều cao. Khi nộp online, tương đương 413×531 pixel ở 300 DPI — đúng kích thước công cụ này xuất ra. Luôn kiểm tra yêu cầu hiện hành cho đúng loại hồ sơ của bạn trên immi.homeaffairs.gov.au.',
  },
  {
    q: 'Tự chụp ảnh visa bằng điện thoại ở nhà được không?',
    a: 'Được, và được chấp nhận rộng rãi nếu đạt chuẩn: ảnh mới chụp (dưới 6 tháng), nền trơn sáng màu, ánh sáng đều không đổ bóng, mặt nghiêm túc miệng khép, mắt mở rõ, không lóa kính (tốt nhất bỏ kính), không đội mũ trừ lý do tôn giáo. Nhờ người khác chụp từ khoảng 1,5m — chụp selfie làm méo tỷ lệ khuôn mặt.',
  },
  {
    q: 'Ảnh của tôi có bị upload lên server không?',
    a: 'Không. Ảnh được xử lý hoàn toàn trong trình duyệt bằng Canvas API — không rời khỏi máy bạn, chúng tôi không nhìn thấy, đóng tab là mất. Đây là điểm khác biệt của Calcroo so với các trang chỉnh ảnh bắt upload lên server của họ.',
  },
  {
    q: 'In ảnh ở đâu cho rẻ?',
    a: 'Tải file khổ in 6×4″ (chứa sẵn 4 ảnh đúng chuẩn kèm vạch cắt) rồi mang ra kiosk Kmart, Big W hoặc Officeworks in như ảnh 6×4 thường — chưa tới 1 đô, so với $17–25 nếu ra tiệm chụp ảnh hộ chiếu. Cắt theo vạch xám là có 4 ảnh dùng dần.',
  },
  {
    q: 'Ảnh chuẩn kích thước rồi sao vẫn bị từ chối?',
    a: 'Kích thước chỉ là một tiêu chí. Lý do rớt phổ biến nhất: bóng đổ trên mặt hoặc nền, tóc che mắt hay viền mặt, cười hoặc hở miệng, lóa kính, ảnh mờ vì nén quá tay, và ảnh chụp quá 6 tháng. Chỉnh lại tấm ảnh gốc, không chỉ khung crop.',
  },
  {
    q: 'Ảnh này dùng được cho hộ chiếu Việt Nam hay hồ sơ khác không?',
    a: 'Chuẩn 35×45mm trùng với nhiều nước (trong đó có quy cách ảnh hộ chiếu Việt Nam phổ biến 3,5×4,5cm và visa Schengen), nhưng mỗi nơi có yêu cầu riêng về nền, tỷ lệ mặt và cách nộp — kiểm tra quy định của cơ quan tiếp nhận trước khi dùng chung một ảnh cho nhiều hồ sơ.',
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
      <SiteHeader homeHref="/vi/" langHref="/visa-photo-resizer/" langLabel="English" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">35×45mm · chuẩn Úc</div>
          <h1>Chỉnh Ảnh Visa Úc Online</h1>
          <p>
            Crop ảnh đúng chuẩn hộ chiếu/visa Úc 35×45mm ngay trên trình duyệt, miễn phí. Tải bản digital để nộp
            online, hoặc khổ in 6×4″ gồm 4 ảnh — ra Kmart in chưa tới 1 đô.
          </p>
        </section>

        <PhotoResizer lang="vi" />

        <article className="content">
          <h2>Chuẩn ảnh Úc, nói cho dễ hiểu</h2>
          <p>
            Ảnh hộ chiếu/visa Úc phải là ảnh màu <strong>35mm × 45mm</strong>, chụp trong vòng 6 tháng, nền{' '}
            <strong>trơn, sáng màu</strong>. Khuôn mặt ở giữa, sắc nét, chiếm <strong>32–36mm từ cằm đến đỉnh đầu</strong>,
            biểu cảm nghiêm túc, miệng khép, mắt mở. Không đội mũ (trừ lý do tôn giáo), và tốt nhất bỏ kính — lóa kính
            là lý do rớt ảnh hàng đầu. Công cụ này khóa sẵn khung 35:45 cho bạn; việc của bạn là căn mặt vào khung và
            chụp một tấm ảnh gốc đạt.
          </p>

          <h2>Cách tự chụp ảnh đạt chuẩn tại nhà</h2>
          <ul>
            <li><strong>Nền:</strong> đứng cách tường trắng/xám nhạt ~0,5m để không đổ bóng lên tường.</li>
            <li><strong>Sáng:</strong> quay mặt về phía cửa sổ hoặc hai nguồn sáng đều — không để bóng lệch một bên mặt.</li>
            <li><strong>Máy:</strong> nhờ người chụp từ ~1,5m, ngang tầm mắt. Chụp selfie gần làm mũi và trán bị méo.</li>
            <li><strong>Tư thế:</strong> vai thẳng, mặt nghiêm, tóc gọn khỏi mặt. Xong upload vào đây, kéo và zoom cho đầu chiếm đúng tỷ lệ khung, rồi tải về.</li>
          </ul>

          <h2>In vài chục cent thay vì hai chục đô</h2>
          <p>
            File <strong>khổ in 6×4″</strong> là chỗ tiết kiệm tiền: 4 ảnh đúng chuẩn kèm vạch cắt gói trong một tấm
            ảnh in thường. Kiosk Kmart, Big W, Officeworks in ảnh 6×4 chưa tới 1 đô — tiết kiệm ~95% so với dịch vụ
            chụp ảnh hộ chiếu $17–25 ngoài tiệm, lại dư ảnh dự phòng cho hồ sơ sau.
          </p>

          <h2>Câu hỏi thường gặp</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p>
            Đang làm hồ sơ? Phần tiền bạc có <Link href="/vi/tinh-hoan-thue-uc/">công cụ Tính Hoàn Thuế</Link>, và
            công cụ gộp PDF giấy tờ sẽ ra mắt tiếp theo.
          </p>

          <p className="disclaimer">
            Calcroo định dạng ảnh theo quy cách 35×45mm được công bố phổ biến của Úc để hỗ trợ người dùng — không liên
            kết với Bộ Nội vụ Úc, và yêu cầu ảnh thay đổi theo loại hồ sơ lẫn thời gian. Luôn xác nhận quy định hiện
            hành tại <a href="https://immi.homeaffairs.gov.au" rel="noopener">immi.homeaffairs.gov.au</a> trước khi
            nộp. Ảnh xử lý ngay trên trình duyệt, không bao giờ được upload.
          </p>
        </article>
      </main>
      <SiteFooter vi />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
