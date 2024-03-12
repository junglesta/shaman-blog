import type { APIContext, InferGetStaticPropsType } from "astro";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { siteConfig } from "@/site-config";
import { getAllPosts, getFormattedDate } from "@/utils";

import RobotoMono from "@/assets/roboto-mono-regular.ttf";
import RobotoMonoBold from "@/assets/roboto-mono-700.ttf";

const ogOptions: SatoriOptions = {
	width: 1200,
	height: 630,
	// debug: true,
	fonts: [
		{
			name: "Roboto Mono",
			data: Buffer.from(RobotoMono),
			weight: 400,
			style: "normal",
		},
		{
			name: "Roboto Mono",
			data: Buffer.from(RobotoMonoBold),
			weight: 700,
			style: "normal",
		},
	],
};

const markup = (title: string, pubDate: string) =>
	html`<div tw="flex flex-col w-full h-full bg-[#1d1f21] text-[#c9cacc]">
		<div tw="flex flex-col flex-1 w-full p-10 justify-center">
			<p tw="text-2xl mb-6">${pubDate}</p>
			<h1 tw="text-6xl font-bold leading-snug text-white">${title}</h1>
		</div>
		<div tw="flex items-center justify-between w-full p-10 border-t border-[#2bbc89] text-xl">
			<div tw="flex items-center">
				<svg
					height="60"
					xmlns="http://www.w3.org/2000/svg"
					xml:space="preserve"
					viewBox="0 0 512.002 512.002"
				>
					<g fill="#29bc89">
						<path
							d="M442.341 199.542a8.895 8.895 0 0 0-5.839-5.276c-29.741-8.456-53.955-1.396-68.383 5.449V87.773c0-23.88-19.428-43.307-43.307-43.307-9.53 0-18.346 3.101-25.505 8.337v-9.497C299.306 19.428 279.878 0 255.999 0s-43.307 19.428-43.307 43.307v9.496c-7.16-5.236-15.974-8.337-25.504-8.337-23.88 0-43.307 19.428-43.307 43.307v111.94c-14.428-6.843-38.649-13.901-68.383-5.447a8.907 8.907 0 0 0-5.215 13.114c.362.608 36.066 61.735 36.066 147.67v7.299c0 82.519 67.134 149.654 149.654 149.654s149.654-67.135 149.654-149.654v-7.299c0-85.935 35.704-147.062 36.061-147.661a8.92 8.92 0 0 0 .623-7.847zm-54.49 155.506v7.299c0 72.703-59.149 131.852-131.852 131.852S124.147 435.05 124.147 362.347v-7.299c0-70.382-22.098-124.042-32.865-146.008 25.966-3.788 45.204 6.193 52.596 10.916v31.992a8.9 8.9 0 0 0 8.901 8.901 8.9 8.9 0 0 0 8.901-8.901V87.773c0-14.064 11.442-25.505 25.505-25.505S212.69 73.71 212.69 87.773v167.184c0 4.916 3.984 8.901 8.901 8.901s8.901-3.985 8.901-8.901V43.307c0-14.064 11.442-25.505 25.505-25.505 14.064 0 25.504 11.442 25.504 25.505v211.65a8.9 8.9 0 0 0 8.901 8.901 8.9 8.9 0 0 0 8.901-8.901V87.773c0-14.064 11.442-25.505 25.505-25.505 14.064 0 25.505 11.442 25.505 25.505v164.176a8.9 8.9 0 0 0 8.901 8.901 8.9 8.9 0 0 0 8.901-8.901v-31.976c7.396-4.687 26.728-14.665 52.593-10.924-10.764 21.968-32.857 75.623-32.857 145.999z"
						/>
						<path
							d="M347.887 348.062c-24.545-24.543-57.178-38.061-91.888-38.061s-67.344 13.516-91.888 38.061a8.9 8.9 0 0 0 0 12.587c24.544 24.544 57.178 38.061 91.888 38.061s67.342-13.516 91.888-38.061a8.9 8.9 0 0 0 0-12.587zm-91.888 32.847c-26.842 0-52.244-9.366-72.474-26.553 20.23-17.186 45.632-26.553 72.474-26.553 26.841 0 52.244 9.366 72.473 26.553-20.229 17.186-45.631 26.553-72.473 26.553z"
						/>
						<path
							d="M256 332.335c-12.143 0-22.022 9.878-22.022 22.021 0 12.142 9.879 22.021 22.022 22.021s22.022-9.879 22.022-22.021c0-12.142-9.879-22.021-22.022-22.021zm0 28.484a6.468 6.468 0 0 1-6.461-6.462 6.468 6.468 0 0 1 6.461-6.462 6.469 6.469 0 0 1 6.461 6.462 6.47 6.47 0 0 1-6.461 6.462z"
						/>
					</g>
				</svg>
				<p tw="ml-3 font-semibold">${siteConfig.title}</p>
			</div>
			<p>by ${siteConfig.author}</p>
		</div>
	</div>`;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
	const { title, pubDate } = context.props as Props;

	const postDate = getFormattedDate(pubDate, {
		weekday: "long",
		month: "long",
	});
	const svg = await satori(markup(title, postDate), ogOptions);
	const png = new Resvg(svg).render().asPng();
	return new Response(png, {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
}

export async function getStaticPaths() {
	const posts = await getAllPosts();
	return posts
		.filter(({ data }) => !data.ogImage)
		.map((post) => ({
			params: { slug: post.slug },
			props: {
				title: post.data.title,
				pubDate: post.data.updatedDate ?? post.data.publishDate,
			},
		}));
}
