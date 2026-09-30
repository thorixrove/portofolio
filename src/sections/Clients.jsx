import { clientReviews } from '../constants/index.js';

// Kartu review (tampilan sama seperti sebelumnya, dibuat lebar tetap agar bisa bergerak)
const ReviewCard = ({ item }) => (
    <div className="client-review w-72 sm:w-96 shrink-0 border border-white/5 transition-colors hover:border-white/20">
        <p className="text-white-800 font-light text-sm sm:text-base">{item.review}</p>

        <div className="client-content">
            <div className="flex gap-3">
                <img src={item.img} alt={item.name} className="w-12 h-12 rounded-full" />
                <div className="flex flex-col">
                    <p className="font-semibold text-white-800">{item.name}</p>
                    <p className="text-white-500 text-sm font-light">{item.position}</p>
                </div>
            </div>

            <div className="flex self-end items-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                    <img key={index} src="/assets/star.png" alt="star" className="w-5 h-5" />
                ))}
            </div>
        </div>
    </div>
);

// Satu baris marquee. Konten diulang supaya selalu lebih lebar dari layar,
// lalu grup diduplikasi 2x agar loop-nya mulus.
const MarqueeRow = ({ items, reverse = false, duration = 40 }) => {
    const repeated = [...items, ...items, ...items];

    return (
        <div className="marquee-mask group flex overflow-hidden">
            {[0, 1].map((copy) => (
                <div
                    key={copy}
                    aria-hidden={copy === 1}
                    style={{
                        '--duration': `${duration}s`,
                        animationDirection: reverse ? 'reverse' : 'normal',
                    }}
                    className="flex shrink-0 gap-5 pr-5 animate-marquee group-hover:[animation-play-state:paused]"
                >
                    {repeated.map((item, i) => (
                        <ReviewCard key={`${copy}-${item.id}-${i}`} item={item} />
                    ))}
                </div>
            ))}
        </div>
    );
};

const Clients = () => {
    const half = Math.ceil(clientReviews.length / 2);
    const rowOne = clientReviews.slice(0, half);
    const rowTwo = clientReviews.slice(half);

    return (
        <section className="c-space my-20">
            <h3 className="head-text">Hear from My Clients</h3>

            <div className="flex flex-col gap-5 mt-12">
                <MarqueeRow items={rowOne} duration={45} />
                <MarqueeRow items={rowTwo.length ? rowTwo : rowOne} reverse duration={50} />
            </div>
        </section>
    );
};

export default Clients;