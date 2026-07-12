"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { useProblems } from "./hooks/useProblems";
import Link from "next/link";

export default function Page() {
	const [search, setSearch] = useState("");
	const [cursor, setCursor] = useState<string | undefined>();
	const [direction, setDirection] = useState<"next" | "prev">("next");

	const { data, isLoading } = useProblems({
		search,
		cursor,
		direction,
	});

	return (
		<div className="container mx-auto py-8 space-y-6">
			<div className="flex items-center gap-3">
				<div className="relative max-w-sm w-full">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

					<Input
						placeholder="Search problems..."
						className="pl-9"
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setCursor(undefined); // Reset pagination when searching
						}}
					/>
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Difficulty</TableHead>
							<TableHead>Created</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={3} className="text-center">
									Loading...
								</TableCell>
							</TableRow>
						) : (
              //@ts-expect-error ignore
							data?.problems.map((problem) => (
								<TableRow key={problem.id}>
									<TableCell>
										<Link href={`/problem/${problem.id}`}>
											{problem.title}{" "}
										</Link>
									</TableCell>
									<TableCell className="capitalize">
										{problem.difficulty}
									</TableCell>
									<TableCell>
										{new Date(problem.createdAt).toLocaleDateString()}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex justify-end gap-2">
				<Button
					variant="outline"
					disabled={!data?.pageInfo.hasPrevPage}
					onClick={() => {
						setDirection("prev");
						setCursor(data?.pageInfo.prevCursor);
					}}
				>
					<ChevronLeft className="mr-2 h-4 w-4" />
					Previous
				</Button>

				<Button
					disabled={!data?.pageInfo.hasNextPage}
					onClick={() => {
						setDirection("next");
						setCursor(data?.pageInfo.nextCursor);
					}}
				>
					Next
					<ChevronRight className="ml-2 h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
