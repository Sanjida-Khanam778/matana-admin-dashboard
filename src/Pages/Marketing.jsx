import { useEffect, useState } from "react";
import { Edit2, Image as ImageIcon, Plus, Trash2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import RichTextEditor from "../components/Settings/RichTextEditor";
import Pagination from "../components/Shared/Pagination";
import DeleteConfirmationModal from "../components/Shared/DeleteConfirmationModal";
import {
	useCreatePlatformMarketingPageMutation,
	useDeletePlatformMarketingPageMutation,
	useGetPlatformMarketingPagesQuery,
	useUpdatePlatformMarketingPageMutation,
} from "../Api/dashboardApi";

const ITEMS_PER_PAGE = 8;

const Marketing = () => {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
	});
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [selectedMarketingPage, setSelectedMarketingPage] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

	const {
		data,
		isLoading: isListing,
		isFetching: isRefreshing,
		error,
	} = useGetPlatformMarketingPagesQuery({
		page: currentPage,
		page_size: ITEMS_PER_PAGE,
	});
	const [createMarketingPage, { isLoading: isCreating }] =
		useCreatePlatformMarketingPageMutation();
	const [updateMarketingPage, { isLoading: isUpdating }] =
		useUpdatePlatformMarketingPageMutation();
	const [deleteMarketingPage, { isLoading: isDeleting }] =
		useDeletePlatformMarketingPageMutation();

	const marketingPages = Array.isArray(data)
		? data
		: data?.results || data?.data || [];
	const totalItems = data?.count ?? marketingPages.length;
	const isSaving = isCreating || isUpdating;
	const isEditing = Boolean(selectedMarketingPage?.id);

	useEffect(() => {
		return () => {
			if (imagePreview?.startsWith("blob:")) {
				URL.revokeObjectURL(imagePreview);
			}
		};
	}, [imagePreview]);

	const stripHtml = (value = "") => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

	const resolveImageSrc = (item) =>
		item?.image?.url || item?.image_url || item?.image || item?.banner || "";

	const resetForm = () => {
		setFormData({ title: "", description: "" });
		setImageFile(null);
		setImagePreview(null);
		setSelectedMarketingPage(null);
	};

	const handleChange = (event) => {
		const { name, value } = event.target;

		setFormData((previous) => ({
			...previous,
			[name]: value,
		}));
	};

	const handleDescriptionChange = (value) => {
		setFormData((previous) => ({
			...previous,
			description: value,
		}));
	};

	const handleImageChange = (event) => {
		const file = event.target.files?.[0];

		if (!file) {
			return;
		}

		if (imagePreview?.startsWith("blob:")) {
			URL.revokeObjectURL(imagePreview);
		}

		setImageFile(file);
		setImagePreview(URL.createObjectURL(file));
	};

	const handleEdit = (item) => {
		setSelectedMarketingPage(item);
		setFormData({
			title: item?.title || "",
			description: item?.description || "",
		});
		setImageFile(null);
		setImagePreview(resolveImageSrc(item) || null);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const plainDescription = stripHtml(formData.description);

		if (!formData.title.trim() || !plainDescription) {
			toast.error("Title and description are required.");
			return;
		}

		if (!isEditing && !imageFile) {
			toast.error("Image is required for a new marketing page.");
			return;
		}

		const payload = new FormData();
		payload.append("title", formData.title.trim());
		payload.append("description", formData.description);
		if (imageFile) {
			payload.append("image", imageFile);
		}

		try {
			if (isEditing) {
				await updateMarketingPage({
					id: selectedMarketingPage.id,
					payload,
				}).unwrap();
				toast.success("Marketing page updated successfully!");
			} else {
				await createMarketingPage(payload).unwrap();
				toast.success("Marketing page created successfully!");
			}

			resetForm();
		} catch (requestError) {
			toast.error(
				requestError?.data?.message ||
					requestError?.data?.error ||
					`Failed to ${isEditing ? "update" : "create"} marketing page`,
			);
		}
	};

	const handleCancel = () => {
		resetForm();
	};

	const handleDelete = async () => {
		if (!deleteTarget?.id) {
			return;
		}

		try {
			await deleteMarketingPage(deleteTarget.id).unwrap();
			toast.success("Marketing page deleted successfully!");
			if (selectedMarketingPage?.id === deleteTarget.id) {
				resetForm();
			}
			setDeleteTarget(null);
		} catch (requestError) {
			toast.error(
				requestError?.data?.message ||
					requestError?.data?.error ||
					"Failed to delete marketing page",
			);
		}
	};

	return (
		<div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl space-y-8">
				<div className="space-y-2">
					<p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
						Marketing
					</p>
					<h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
						Manage marketing pages
					</h1>
					<p className="max-w-2xl text-sm text-slate-600 sm:text-base">
						Create, edit, review, and delete marketing content from one workspace.
					</p>
				</div>

				<div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
					<form onSubmit={handleSubmit}>
						<div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
							<div className="space-y-6 p-6 sm:p-8">
								<div className="flex items-start justify-between gap-4">
									<div>
										<p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
											{isEditing ? "Edit page" : "Create page"}
										</p>
										<h2 className="mt-1 text-2xl font-semibold text-slate-900">
											{isEditing ? "Update marketing content" : "New marketing content"}
										</h2>
									</div>
									{isEditing ? (
										<span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
											Editing ID #{selectedMarketingPage.id}
										</span>
									) : null}
								</div>

								<div>
									<label
										htmlFor="title"
										className="mb-2 block text-sm font-medium text-slate-700"
									>
										Title
									</label>
									<input
										id="title"
										name="title"
										type="text"
										value={formData.title}
										onChange={handleChange}
										placeholder="Enter page title"
										className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
									/>
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium text-slate-700">
										Description
									</label>
									<RichTextEditor
										initialContent={formData.description}
										onChange={handleDescriptionChange}
									/>
								</div>
							</div>

							<div className="border-t border-slate-200 bg-slate-50/80 p-6 sm:p-8 lg:border-l lg:border-t-0">
								<div>
									<label className="mb-2 block text-sm font-medium text-slate-700">
										Image Upload
									</label>
									<label
										htmlFor="image"
										className="flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-8 text-center transition hover:border-emerald-400 hover:bg-emerald-50/60"
									>
										{imagePreview ? (
											<img
												src={imagePreview}
												alt="Marketing preview"
												className="mb-4 h-56 w-full rounded-2xl object-cover shadow-sm"
											/>
										) : (
											<div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
												<ImageIcon size={32} />
											</div>
										)}

										<p className="text-base font-semibold text-slate-900">
											{imagePreview ? "Replace image" : "Upload image"}
										</p>
										<p className="mt-1 text-sm text-slate-500">
											PNG, JPG, WEBP, or GIF
										</p>
										<div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
											<Upload size={16} />
											Choose file
										</div>
									</label>
									<input
										id="image"
										type="file"
										accept="image/*"
										onChange={handleImageChange}
										className="sr-only"
									/>
								</div>
							</div>
						</div>

						<div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
							<button
								type="button"
								onClick={handleCancel}
								className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-white"
							>
								{isEditing ? "Cancel edit" : "Reset"}
							</button>
							<button
								type="submit"
								disabled={isSaving}
								className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
							>
								{isSaving ? "Saving..." : isEditing ? "Update Marketing Page" : "Save Marketing Page"}
							</button>
						</div>
					</form>
				</div>

				<div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
					<div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-5 sm:px-8">
						<div>
							<h2 className="text-xl font-semibold text-slate-900">Marketing pages</h2>
							<p className="text-sm text-slate-500">
								{isRefreshing && !isListing ? "Loading pages..." : `${totalItems} total record${totalItems === 1 ? "" : "s"}`}
							</p>
						</div>
						<button
							type="button"
							onClick={() => {
								resetForm();
								window.scrollTo({ top: 0, behavior: "smooth" });
							}}
							className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
						>
							<Plus size={16} />
							New page
						</button>
					</div>

					{error ? (
						<div className="px-6 py-10 text-sm text-red-600 sm:px-8">
							Failed to load marketing pages.
						</div>
					) : isListing ? (
						<div className="px-6 py-10 text-sm text-slate-500 sm:px-8">Loading marketing pages...</div>
					) : marketingPages.length ? (
						<div className="overflow-x-auto">
							<table className="w-full min-w-[760px]">
								<thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
									<tr>
										<th className="px-6 py-4 sm:px-8">Page</th>
										<th className="px-6 py-4">Description</th>
										<th className="px-6 py-4 text-right">Actions</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{marketingPages.map((item) => {
										const thumbnail = resolveImageSrc(item);
										const previewText = stripHtml(item?.description || "");

										return (
											<tr key={item.id} className="align-top transition hover:bg-slate-50/80">
												<td className="px-6 py-5 sm:px-8">
													<div className="flex items-center gap-4">
														<div className="h-16 w-24 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
															{thumbnail ? (
																<img
																	src={thumbnail}
																	alt={item?.title || "Marketing page"}
																	className="h-full w-full object-cover"
																/>
															) : (
																<div className="flex h-full w-full items-center justify-center text-slate-400">
																	<ImageIcon size={20} />
																</div>
															)}
														</div>
														<div>
															<p className="font-semibold text-slate-900">{item?.title || "Untitled page"}</p>
															<p className="mt-1 max-w-[24rem] text-sm text-slate-500">
																{previewText || "No description added yet."}
															</p>
														</div>
													</div>
												</td>

												<td className="px-6 py-5 text-sm text-slate-600 sm:px-8">
													<div className="line-clamp-3 max-w-2xl">
														{previewText || "No description added yet."}
													</div>
												</td>

												<td className="px-6 py-5 sm:px-8">
													<div className="flex justify-end gap-2">
														<button
															type="button"
															onClick={() => handleEdit(item)}
															className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
														>
															<Edit2 size={16} />
															Edit
														</button>
														<button
															type="button"
															onClick={() => setDeleteTarget(item)}
															className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
														>
															<Trash2 size={16} />
															Delete
														</button>
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					) : (
						<div className="px-6 py-12 text-center sm:px-8">
							<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
								<ImageIcon size={28} />
							</div>
							<h3 className="text-lg font-semibold text-slate-900">No marketing pages yet</h3>
							<p className="mt-1 text-sm text-slate-500">
								Use the form above to create the first marketing page.
							</p>
						</div>
					)}

					{totalItems > ITEMS_PER_PAGE ? (
						<div className="border-t border-slate-200 px-6 py-4 sm:px-8">
							<Pagination
								currentPage={currentPage}
								totalItems={totalItems}
								itemsPerPage={ITEMS_PER_PAGE}
								onPageChange={setCurrentPage}
							/>
						</div>
					) : null}
				</div>
			</div>

			<DeleteConfirmationModal
				isOpen={Boolean(deleteTarget)}
				onClose={() => {
					if (!isDeleting) {
						setDeleteTarget(null);
					}
				}}
				onConfirm={handleDelete}
				title="Delete marketing page?"
				message={`This will permanently remove ${deleteTarget?.title || "this marketing page"}.`}
				confirmText={isDeleting ? "Deleting..." : "Delete"}
			/>
		</div>
	);
};

export default Marketing;